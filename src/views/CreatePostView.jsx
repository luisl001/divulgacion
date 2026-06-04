import { useState, useEffect, useRef } from 'react';
import * as fabric from 'fabric';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ENDPOINTS } from '../config/apiConfig.js';

const CreatePostView = ({ user }) => {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const previewFabricRef = useRef(null);
  const fileInputRef = useRef(null);
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit'); // Obtenemos el ID si existe
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [currentTemplateUrl, setCurrentTemplateUrl] = useState(null);
  // NUEVOS ESTADOS: Gestión de fondo del Banner
  const [bannerBgColor, setBannerBgColor] = useState('#ffffff');
  const [isTemplateApplied, setIsTemplateApplied] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const FONT_OPTIONS = [
    "Segoe UI", "Arial", "Courier New", "Verdana", "Georgia", "Times New Roman",
    "Roboto", "Open Sans", "Lato", "Montserrat", "Poppins", "Ubuntu", "Raleway",
    "Playfair Display", "Merriweather", "Lora", "Cinzel",
    "Anton", "Bebas Neue", "Oswald", "Bangers",
    "Dancing Script", "Pacifico", "Caveat", "Lobster", "Permanent Marker"
  ];
  const openEditNoteModal = () => {
    const canvas = fabricRef.current;
    const activeObject = canvas.getActiveObject();
  
    // Validar que sea una nota (usando el ID que ya asignas)
    if (!activeObject || !(activeObject.id === 'note-group' || activeObject.id === 'note-text')) {
      return alert('Por favor, selecciona una nota para editar.');
    }
  
    setIsEditingNote(true);
    disposePreview();
  
    // Extraer información según el tipo de objeto
    let config = { ...defaultNoteConfig };
  
    if (activeObject.type === 'group') {
      const shape = activeObject._objects[0];
      const textObj = activeObject._objects[1];
      
      config = {
        text: textObj.text,
        shape: activeObject.noteType || 'rect',
        bgColor: shape.fill,
        fill: textObj.fill,
        fontSize: textObj.fontSize,
        fontFamily: textObj.fontFamily,
        fontWeight: textObj.fontWeight,
        textAlign: textObj.textAlign,
        useShadow: !!textObj.shadow,
        shadowColor: textObj.shadow?.color || '#000000',
        shadowBlur: textObj.shadow?.blur || 5,
      };
    } else {
      // Caso solo texto
      config = {
        ...defaultNoteConfig,
        text: activeObject.text,
        shape: 'none',
        fill: activeObject.fill,
        fontSize: activeObject.fontSize,
        fontFamily: activeObject.fontFamily,
        fontWeight: activeObject.fontWeight,
        useShadow: !!activeObject.shadow,
        shadowColor: activeObject.shadow?.color || '#000000',
      };
    }
  
    setNoteConfig(config);
    setShowNoteModal(true);
  };
  const defaultNoteConfig = {
    text: '', shape: 'rect', bgColor: '#22c55e', fill: '#ffffff',
    fontSize: 18, fontFamily: 'Segoe UI', fontWeight: 'bold',
    useShadow: false, shadowColor: '#000000', shadowBlur: 5, textAlign: 'left'
  };

  const [noteConfig, setNoteConfig] = useState(defaultNoteConfig);
  const [post, setPost] = useState({ postitle: '', content: '', category_id: '', user_id: user?.id });
  const [templates, setTemplates] = useState([]);

  // Estados de Título y Cuerpo
  const [titleStyles, setTitleStyles] = useState({ fontSize: 32, fill: '#1a1a1a', fontWeight: 'bold', fontFamily: 'Segoe UI', useShadow: false, shadowColor: '#000000', shadowBlur: 10, textAlign: 'left' });
  const [contentStyles, setContentStyles] = useState({ fontSize: 18, fill: '#ffffff', fontWeight: 'normal', fontFamily: 'Segoe UI', useShadow: true, shadowColor: '#000000', shadowBlur: 15, textAlign: 'left' });

  const createShape = (type, color) => {
    const common = { fill: color, originX: 'center', originY: 'center', width: 120, height: 60 };
    switch (type) {
      case 'Rectangulo':   return new fabric.Rect(common);
      case 'Rectangulo-2':  return new fabric.Rect({ ...common, rx: 15, ry: 15 });
      case 'Circulo': return new fabric.Circle({ ...common, radius: 40 });
      case 'Rombo':  return new fabric.Rect({ ...common, angle: 45, width: 60, height: 60 });
      case 'Estrella': return new fabric.Polygon([{ x: 0, y: -40 }, { x: 10, y: -10 }, { x: 40, y: -10 }, { x: 15, y: 10 }, { x: 25, y: 40 }, { x: 0, y: 20 }, { x: -25, y: 40 }, { x: -15, y: 10 }, { x: -40, y: -10 }, { x: -10, y: -10 }], { fill: color, originX: 'center', originY: 'center' });
      case 'Nube': return new fabric.Path('M 25 10 C 15 10 10 15 10 25 C 10 35 15 40 25 40 C 25 45 35 50 45 50 C 55 50 60 45 60 40 C 70 40 75 35 75 25 C 75 15 70 10 60 10 C 60 5 55 0 45 0 C 35 0 30 5 25 10 Z', { fill: color, originX: 'center', originY: 'center', scaleX: 1.5, scaleY: 1.5 });
      default: return new fabric.Rect(common);
    }
  };

  const disposePreview = () => { if (previewFabricRef.current) { previewFabricRef.current.dispose(); previewFabricRef.current = null; } };
  const openNewNoteModal = () => { disposePreview();
    setIsEditingNote(false);
    setNoteConfig(defaultNoteConfig); setShowNoteModal(true); };
  const closeNoteModal = () => { disposePreview(); setShowNoteModal(false); };

  const deleteSelectedObject = () => {
    if (!fabricRef.current) return;
    const canvas = fabricRef.current;
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      if (activeObject.selectable === false) return alert('Elemento institucional bloqueado.');
      canvas.remove(activeObject);
      canvas.discardActiveObject();
      canvas.renderAll();
    } else { alert('Selecciona un objeto para borrar.'); }
  };

  // AJUSTE: Limpiar fondo ahora también resetea el estado isTemplateApplied
  const clearBackground = () => {
    if (!fabricRef.current) return;
    fabricRef.current.backgroundImage = null;
    fabricRef.current.backgroundColor = bannerBgColor;
    setIsTemplateApplied(false);
    setCurrentTemplateUrl(null); // Limpiamos la referencia
    fabricRef.current.renderAll();
    setShowGallery(false);
  };

  // AJUSTE: Aplicar plantilla ahora marca que hay una plantilla activa
  const applyTemplate = (imageUrl) => {
    console.log("Cargando plantilla desde:", imageUrl); // <--- DEBUG
    fabric.Image.fromURL(imageUrl, { crossOrigin: 'anonymous' }).then((img) => {
      img.set({ scaleX: 600 / img.width, scaleY: 300 / img.height, originX: 'left', originY: 'top' });
      
      fabricRef.current.backgroundImage = img;
      setIsTemplateApplied(true);
      
      // GUARDAMOS EL URL: Aquí capturamos la ruta para el guardado posterior
      setCurrentTemplateUrl(imageUrl); 
      
      fabricRef.current.renderAll();
      setShowGallery(false);
    });
  };

  const processImage = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (f) => {
      fabric.Image.fromURL(f.target.result).then((img) => {
        img.set({ scaleX: 180 / img.width, scaleY: 180 / img.width, left: 400, top: 80, id: 'post-img', imageSmoothing: true });
        fabricRef.current.add(img);
        fabricRef.current.renderAll();
      });
    };
    reader.readAsDataURL(file);
  };

  const addNoteToCanvas = () => {
    const canvas = fabricRef.current;
    const activeObject = canvas.getActiveObject();

const pos = isEditingNote && activeObject 
? { left: activeObject.left, top: activeObject.top } 
: { left: 150, top: 150 };


    const shadow = noteConfig.useShadow ? new fabric.Shadow({ color: noteConfig.shadowColor, blur: noteConfig.shadowBlur, offsetX: 0, offsetY: 0 }) : null;
    const textOptions = { fontSize: noteConfig.fontSize, fill: noteConfig.fill, fontFamily: noteConfig.fontFamily, fontWeight: noteConfig.fontWeight, shadow, textAlign: 'center', originX: 'center', originY: 'center', lineHeight: 1.1 };
    let newObj;
    if (noteConfig.shape === 'none') {
      newObj = new fabric.IText(noteConfig.text, { 
        ...textOptions, 
        left: pos.left, 
        top: pos.top, 
        id: 'note-text' 
      });
    } else {
      newObj = new fabric.Group([
        createShape(noteConfig.shape, noteConfig.bgColor), 
        new fabric.IText(noteConfig.text, textOptions)
      ], { 
        left: pos.left, 
        top: pos.top, 
        selectable: true, 
        id: 'note-group', 
        noteType: noteConfig.shape 
      });
    }
    if (isEditingNote && activeObject) {
      canvas.remove(activeObject);
    }
    canvas.add(newObj);
    canvas.setActiveObject(newObj);
    canvas.renderAll();
    
    disposePreview();
    setShowNoteModal(false);
  };

  const handlePost = async (e) => {
    e.preventDefault();
    setIsPublishing(true);
    const canvas = fabricRef.current;
    const bannerData = canvas.toDataURL({ format: 'png', multiplier: 3, enableRetinaScaling: true });
    
    const tObj = canvas.getObjects().find(o => o.id === 'post-title');
    const cObj = canvas.getObjects().find(o => o.id === 'post-body');
    const notesOnCanvas = canvas.getObjects().filter(o => o.id?.startsWith('note-'));  
    const notesData = notesOnCanvas.map(n => {
      // Si es grupo, el texto es el segundo objeto [1]
      const isGroup = n.type === 'group';
      const textElement = isGroup ? n._objects[1] : n;
      const shapeElement = isGroup ? n._objects[0] : null;
  
      return {
        id: n.id,
        text: textElement.text,
        left: n.left,
        top: n.top,
        type: isGroup ? n.noteType : 'none',
        // Guardamos estilos para que el Edit Mode sea idéntico
        styles: {
          fontSize: textElement.fontSize,
          fill: textElement.fill,
          fontFamily: textElement.fontFamily,
          fontWeight: textElement.fontWeight,
          textAlign: textElement.textAlign,
          bgColor: shapeElement ? shapeElement.fill : null,
          useShadow: !!textElement.shadow,
          shadowColor: textElement.shadow?.color || '#000000',
          shadowBlur: textElement.shadow?.blur || 0
        }
      };
    });
    console.log("Notas capturadas:", notesData); // Ahora verás el array lleno
    const url = editId ? ENDPOINTS.API_BASE_URL + '/api/editpost' : ENDPOINTS.API_BASE_URL + '/api/post';
  
    try {
      // 1. Guardar Post e Imagen
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...post, image_data: bannerData, postid: editId })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error en fase 1");
  
      console.log("Post guardado, procediendo a guardar detalles...");
  
      // 2. Guardar Detalles (Plano)
      const resDetails = await fetch(ENDPOINTS.API_BASE_URL + '/api/saveposdetails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: editId || data.postId,
          title_data: { ...titleStyles, left: tObj?.left, top: tObj?.top },
          content_data: { ...contentStyles, left: cObj?.left, top: cObj?.top },
          background_data: { color: bannerBgColor },
          nameofplantilla: currentTemplateUrl ? currentTemplateUrl.split('/').pop() : null,
          notes_data: notesData,
          notes_text: notesData.map(n => n.text)
        })
      });
      if (resDetails.ok) {
       
        navigate('/', { state: { success: true, message: 'Publicado correctamente' } });
      } else {
        const errDetail = await resDetails.json();
        setIsPublishing(false); // Enable the UI again
        alert(`Post creado, pero error al guardar el plano: ${errDetail.error}`);
      }

  
    } catch (err) {
      setIsPublishing(false); // Enable the UI again
      console.error("Critical Save Error:", err);
      alert('Error al procesar el guardado: ' + err.message);
    }
  };
  
  useEffect(() => {
    if (editId && fabricRef.current) {
      fetch(ENDPOINTS.API_BASE_URL + `/api/post-details/${editId}`)
        .then(res => res.json())
        .then(data => {
                    // 4. Restaurar Plantilla
                    if (data.nameofplantilla) {
                      applyTemplate(`/templates/${data.nameofplantilla}`);
                    }
          // 1. Rellenar estado del post (Texto y Categoría)
          setPost({
            postitle: data.postitle,
            content: data.content,
            category_id: data.category_id,
            user_id: user?.id
          });
  
          // 2. Parsear metadatos
          const titleSty = JSON.parse(data.title_data);
          const contentSty = JSON.parse(data.content_data);
          const bgSty = JSON.parse(data.background_data);
          const savedNotes = JSON.parse(data.notes_data) || [];
  
          // 3. Restaurar estados de estilos
          setTitleStyles(titleSty);
          setContentStyles(contentSty);
          setBannerBgColor(bgSty.color);
          

  
          // 5. Reconstruir Notas en el Canvas
// Dentro del useEffect que carga los detalles para editar
          savedNotes.forEach(n => {
            // 1. Extraer estilos del objeto anidado
            const s = n.styles;
            
            // 2. Preparar opciones de texto
            const shadow = s.useShadow
              ? new fabric.Shadow({ color: s.shadowColor, blur: s.shadowBlur, offsetX: 0, offsetY: 0 })
              : null;

            const textOptions = {
              fontSize: s.fontSize,
              fill: s.fill,
              fontFamily: s.fontFamily,
              fontWeight: s.fontWeight,
              textAlign: s.textAlign,
              shadow: shadow,
              originX: 'center',
              originY: 'center'
            };

            if (n.type === 'none') {
              // Caso: Solo texto
              const textObj = new fabric.IText(n.text, { 
                ...textOptions, 
                left: n.left, 
                top: n.top,
                id: 'note-text' 
              });
              fabricRef.current.add(textObj);
            } else {
              // Caso: Grupo con Forma
              // Usamos s.bgColor porque ahí es donde se guardó el color de la forma
              const shape = createShape(n.type, s.bgColor); 
              const text = new fabric.IText(n.text, textOptions);

              const group = new fabric.Group([shape, text], {
                left: n.left,
                top: n.top,
                id: 'note-group',
                noteType: n.type, // Restauramos el tipo para futuras ediciones
                selectable: true
              });

              fabricRef.current.add(group);
            }
          });
  
          fabricRef.current.renderAll();
        });
    }
  }, [editId, categories]); // categories como dependencia para asegurar que el select se llene
  // Sincronización del Color de Fondo del Banner
  useEffect(() => {
    if (!fabricRef.current) return;
    fabricRef.current.backgroundColor = bannerBgColor;
    fabricRef.current.renderAll();
  }, [bannerBgColor]);

  // Inicializar canvas principal
  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, { width: 600, height: 300, backgroundColor: '#ffffff', enableRetinaScaling: true });
    fabricRef.current = canvas;
    return () => canvas.dispose();
  }, []);

  // Cargar Templates (XML + Local)
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('/templates.xml');
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        const items = xmlDoc.getElementsByTagName("template");
        const serverTemplates = Array.from(items).map(item => ({ id: `server-${item.getElementsByTagName("id")[0].textContent}`, url: item.getElementsByTagName("url")[0].textContent, name: item.getElementsByTagName("name")[0].textContent, isCustom: false }));
        const savedCustom = JSON.parse(localStorage.getItem('custom_templates') || '[]');
        setTemplates([...serverTemplates, ...savedCustom]);
      } catch (err) { console.error("Error cargando plantillas:", err); }
    };
    fetchTemplates();
  }, []);



  const handleUploadBackground = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (f) => {
      const customName = window.prompt("Introduce un nombre:", "Mi Fondo");
      if (customName) {
        const newTemplate = { id: `custom-${Date.now()}`, url: f.target.result, name: customName, isCustom: true };
        const currentCustoms = JSON.parse(localStorage.getItem('custom_templates') || '[]');
        localStorage.setItem('custom_templates', JSON.stringify([...currentCustoms, newTemplate]));
        setTemplates(prev => [...prev, newTemplate]);
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    fetch(ENDPOINTS.API_BASE_URL + '/api/categories').then(res => res.json()).then(data => {
      setCategories(data);
      if (data.length > 0) setPost(prev => ({ ...prev, category_id: data[0].id }));
    });
  }, []);

  // Sincronización de Textos
// ─── EFECTO: Sincronizar textos (VERSIÓN FIX CLIPPING) ──────────────────
useEffect(() => {
  if (!fabricRef.current) return;
  const canvas = fabricRef.current;

  const updateText = (id, content, config, styles) => {
    const existing = canvas.getObjects().find(obj => obj.id === id);
    if (existing) canvas.remove(existing);
    if (!content || content.trim() === '') { canvas.renderAll(); return; }

    const shadow = styles.useShadow
      ? new fabric.Shadow({ color: styles.shadowColor, blur: styles.shadowBlur, offsetX: 0, offsetY: 0 })
      : null;

    // LÓGICA DE POSICIONAMIENTO
    let finalLeft = config.left;
    let finalOriginX = 'left';

    if (styles.textAlign === 'center') {
      finalLeft = config.left + (config.width / 2);
      finalOriginX = 'center';
    } else if (styles.textAlign === 'right') {
      finalLeft = config.left + config.width;
      finalOriginX = 'right';
    }

    // OPCIÓN SENIOR: Usamos Textbox para el cuerpo para mejor manejo de alineación
    const textClass = id === 'post-body' ? fabric.Textbox : fabric.IText;

    const textObj = new textClass(content, {
      id,
      ...config,
      left: finalLeft,
      originX: finalOriginX,
      fontSize: styles.fontSize,
      fill: styles.fill,
      fontWeight: styles.fontWeight,
      fontFamily: styles.fontFamily,
      textAlign: styles.textAlign,
      shadow,
      // padding para evitar el recorte en los bordes
      padding: 10, 
      splitByGrapheme: false,
      width: config.width,

      dirty: true 
    });

    canvas.add(textObj);
    // Recalculamos el área de control para que coincida con el nuevo renderizado
    textObj.setCoords(); 
  };

  updateText('post-title', post.postitle, { left: 40, top: 85, width: 360 }, titleStyles);
  updateText('post-body', post.content, { left: 40, top: 145, width: 380, lineHeight: 1.2 }, contentStyles);
  
  canvas.renderAll();
}, [post.postitle, post.content, titleStyles, contentStyles]);

  const renderPreview = (config) => {
    const pCanvas = previewFabricRef.current; if (!pCanvas) return;
    pCanvas.clear(); pCanvas.backgroundColor = '#f3f4f6';
    const shadow = config.useShadow ? new fabric.Shadow({ color: config.shadowColor, blur: config.shadowBlur, offsetX: 0, offsetY: 0 }) : null;
    const textOptions = { fontSize: config.fontSize, fill: config.fill, fontFamily: config.fontFamily, fontWeight: config.fontWeight, shadow, textAlign: config.textAlign, originX: config.textAlign === 'center' ? 'center' : (config.textAlign === 'right' ? 'right' : 'left'), originY: 'center', lineHeight: 1.1, width: config.shape === 'none' ? 200 : config.width - 20 };
    if (config.shape === 'none') { pCanvas.add(new fabric.IText(config.text.trim() || 'Vista Previa', { ...textOptions, left: 125, top: 90, originX: 'center' })); } 
    else { pCanvas.add(new fabric.Group([createShape(config.shape, config.bgColor, config.width), new fabric.IText(config.text.trim() || '', textOptions)], { left: 125, top: 90, originX: 'center', originY: 'center' })); }
    pCanvas.renderAll();
  };

  useEffect(() => {
    if (!showNoteModal) return;
    const timer = setTimeout(() => {
      if (!previewCanvasRef.current) return;
      disposePreview();
      previewFabricRef.current = new fabric.Canvas(previewCanvasRef.current, { width: 250, height: 180, backgroundColor: '#f3f4f6', selection: false });
      renderPreview(noteConfig);
    }, 0);
    return () => clearTimeout(timer);
  }, [showNoteModal]);

  useEffect(() => { if (showNoteModal && previewFabricRef.current) renderPreview(noteConfig); }, [noteConfig]);

  const StyleControls = ({ styles, setStyles, label, showShadow = true }) => {
    const AlignButton = ({ value, icon }) => (
      <button type="button" onClick={() => setStyles({ ...styles, textAlign: value })} className={`p-1.5 px-3 border transition-all text-[10px] font-bold ${styles.textAlign === value ? 'bg-blue-900 text-white border-blue-900 shadow-inner scale-95' : 'bg-white text-gray-400 border-gray-200 hover:bg-gray-50'}`}>{icon}</button>
    );
    return (
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-col gap-1"><label className="text-[8px] font-bold text-gray-400 uppercase">{label} Fuente</label><select className="p-1 border rounded bg-white text-[10px] font-bold w-32" value={styles.fontFamily} onChange={(e) => setStyles({ ...styles, fontFamily: e.target.value })}>{FONT_OPTIONS.map(font => (<option key={font} value={font} style={{ fontFamily: font }}>{font}</option>))}</select></div>
        <div className="flex flex-col gap-1"><label className="text-[8px] font-bold text-gray-400 uppercase">Tam.</label><input type="number" className="w-12 p-1 border rounded text-[10px] font-bold" value={styles.fontSize} onChange={(e) => setStyles({ ...styles, fontSize: parseInt(e.target.value) || 0 })} /></div>
        <div className="flex flex-col gap-1"><label className="text-[8px] font-bold text-gray-400 uppercase text-center">Alineación</label><div className="flex rounded overflow-hidden shadow-sm"><AlignButton value="left" icon="L" /><AlignButton value="center" icon="C" /><AlignButton value="right" icon="R" /></div></div>
        <div className="flex flex-col gap-1"><label className="text-[8px] font-bold text-gray-400 uppercase">Color</label><input type="color" className="h-6 w-8 border-none cursor-pointer" value={styles.fill} onChange={(e) => setStyles({ ...styles, fill: e.target.value })} /></div>
        <button type="button" onClick={() => setStyles({ ...styles, fontWeight: styles.fontWeight === 'bold' ? 'normal' : 'bold' })} className={`p-1 px-3 mt-3 rounded text-[10px] font-black border ${styles.fontWeight === 'bold' ? 'bg-blue-900 text-white shadow-md scale-105' : 'bg-white text-gray-500'}`}>B</button>
        {showShadow && (<div className="flex items-center gap-2 border-l pl-3 border-gray-200"><div className="flex flex-col gap-1 items-center"><label className="text-[8px] font-bold text-gray-400 uppercase">Sombra</label><input type="checkbox" checked={styles.useShadow} className="mt-2 accent-blue-900" onChange={(e) => setStyles({ ...styles, useShadow: e.target.checked })} /></div>{styles.useShadow && (<><div className="flex flex-col gap-1"><label className="text-[8px] font-bold text-gray-400 uppercase">Color Somb.</label><input type="color" className="h-6 w-8 border-none cursor-pointer" value={styles.shadowColor} onChange={(e) => setStyles({ ...styles, shadowColor: e.target.value })} /></div><div className="flex flex-col gap-1"><label className="text-[8px] font-bold text-gray-400 uppercase">Intensidad</label><input type="number" min="0" max="50" className="w-10 p-1 border rounded text-[10px]" value={styles.shadowBlur} onChange={(e) => setStyles({ ...styles, shadowBlur: parseInt(e.target.value) || 0 })} /></div></>)}</div>)}
      </div>
    );
  };

  return (
    <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row min-h-[85vh] bg-gray-50 shadow-xl">
      <div className="flex-1 bg-white p-12 border-r flex flex-col justify-center">
        <header className="mb-8"><h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Crear Divulgación</h2><div className="h-1.5 w-20 bg-blue-800 mt-2"></div></header>
        
        <form onSubmit={handlePost} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1"><label className="text-[10px] font-black text-gray-400 uppercase">Categoría</label><select className="p-3 bg-gray-50 border rounded font-bold text-sm outline-none" value={post.category_id} onChange={e => setPost({ ...post, category_id: e.target.value })}>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
            <div className="p-3 bg-blue-50 border border-blue-100 rounded text-sm uppercase self-end font-bold text-blue-800"><span className="text-[10px] text-gray-400 block mb-1">AUTOR</span>{user?.username || 'marco redsi'}</div>
          </div>

          {/* ─── SECCIÓN: FONDO DEL BANNER ─── */}
          <div className="bg-gray-50 p-4 border rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black text-gray-900 uppercase italic">Configuración de Fondo</h4>
              {isTemplateApplied && <span className="text-[9px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold uppercase">Plantilla Activa</span>}
            </div>

            <div className="flex gap-4">
              {/* Selector de Color (Solo visible/editable si no hay plantilla, o superpuesto si la hay) */}
              <div className="flex-1 space-y-1">
                <label className="text-[8px] font-bold text-gray-400 uppercase">Color de Fondo</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="color" 
                    className="h-10 w-full border-none cursor-pointer rounded-md shadow-sm"
                    value={bannerBgColor} 
                    onChange={(e) => setBannerBgColor(e.target.value)} 
                  />
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-end">
                <button type="button" onClick={() => setShowGallery(true)} className="w-full h-10 border-2 border-blue-900 text-blue-900 font-bold hover:bg-blue-50 transition-colors uppercase text-[10px] tracking-widest rounded-md">
                  Elegir Plantilla
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4"><div className="bg-gray-50 p-3 border rounded-sm scale-95 origin-left"><StyleControls styles={titleStyles} setStyles={setTitleStyles} label="Título" /></div><input className="w-full p-4 border-2 border-gray-100 rounded-lg text-xl font-bold focus:border-blue-800 outline-none" placeholder="Título..." value={post.postitle} onChange={e => setPost({ ...post, postitle: e.target.value })} /></div>
          <div className="space-y-4"><div className="bg-gray-50 p-3 border rounded-sm scale-95 origin-left"><StyleControls styles={contentStyles} setStyles={setContentStyles} label="Cuerpo" /></div><textarea className="w-full p-4 border-2 border-gray-100 rounded-lg h-44 resize-none focus:border-blue-800 outline-none" placeholder="Cuerpo..." value={post.content} onChange={e => setPost({ ...post, content: e.target.value })} /></div>
          <div className="flex gap-2">
            <button type="button" onClick={openNewNoteModal} className="flex-[2] bg-blue-50 text-blue-900 py-3 font-bold border-2 border-blue-200 rounded-sm hover:bg-blue-100 transition-all uppercase text-[10px] tracking-widest">+ Nota</button>
            <button type="button" onClick={openEditNoteModal} className="flex-1 bg-amber-50 text-amber-700 py-3 font-bold border-2 border-amber-200 rounded-sm hover:bg-amber-100 transition-all uppercase text-[10px] tracking-widest">Editar ✏️</button>
            <button type="button" onClick={deleteSelectedObject} className="flex-1 bg-red-50 text-red-700 py-3 font-bold border-2 border-red-100 rounded-sm hover:bg-red-100 transition-all uppercase text-[10px] tracking-widest flex items-center justify-center gap-2">Borrar 🗑️</button></div>
          <div onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={(e) => { e.preventDefault(); setIsDragging(false); processImage(e.dataTransfer.files[0]); }} className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${isDragging ? 'border-blue-800 bg-blue-50' : 'border-gray-200'}`}><p className="text-xs font-bold text-gray-500 uppercase">Logo aquí</p><input type="file" accept="image/*" className="mt-2 text-[10px] mx-auto" onChange={(e) => processImage(e.target.files[0])} /></div>
          <button 
  type="submit" 
  disabled={isPublishing} 
  className={`w-full py-5 font-black text-lg uppercase tracking-widest transition-all shadow-xl 
    ${isPublishing 
      ? 'bg-gray-400 cursor-not-allowed' 
      : 'bg-blue-900 text-white hover:bg-blue-800 hover:-translate-y-1'
    }`}
>
  {isPublishing ? (
    <span className="flex items-center justify-center gap-2">
      {/* */}
      PROCESANDO...
    </span>
  ) : (
    editId ? 'GUARDAR CAMBIOS' : 'PUBLICAR'
  )}
</button>
         </form>
         {isPublishing && (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999
      }}>
        <div className="spinner"></div> {/* Add CSS for a spinning animation */}
        <p style={{ marginTop: '10px', fontWeight: 'bold', color: '#333' }}>
          Publicando...
        </p>
      </div>
    )}
      </div>

      <div className="flex-1 bg-gray-100 flex flex-col items-center justify-center p-8 relative overflow-hidden"><div style={{ transform: 'scale(0.85)', transformOrigin: 'center' }} className="bg-white p-1 shadow-2xl border-4 border-white rounded-lg"><canvas ref={canvasRef} /></div></div>

      {showNoteModal && (

<div className="fixed inset-0 bg-black/70 z-[110] flex items-center justify-center p-4 backdrop-blur-md">

  <div className="bg-white w-full max-w-5xl p-10 rounded-lg shadow-2xl border-t-8 border-blue-800 flex flex-col md:flex-row gap-8">



    {/* IZQUIERDA: texto + forma */}

    <div className="flex-1 space-y-4">

      <h3 className="text-2xl font-black text-blue-900 uppercase italic tracking-tighter">
      {isEditingNote ? 'Editar Nota' : 'Nueva Nota'}
         </h3>

      <textarea

        className="w-full p-4 border-2 border-gray-100 rounded font-bold h-32 resize-none focus:border-blue-500"

        placeholder="Escribe aquí..." value={noteConfig.text}

        onChange={e => setNoteConfig({ ...noteConfig, text: e.target.value })} />



      <label className="text-[10px] font-black text-gray-400 uppercase block">Elegir Diseño</label>

      <div className="grid grid-cols-3 gap-2">

        {['Rectangulo', 'Rectangulo-2', 'Circulo', 'Estrella', 'Nube', 'Rombo'].map(s => (

          <button key={s} type="button" onClick={() => setNoteConfig({ ...noteConfig, shape: s })}

            className={`p-2 border-2 rounded uppercase text-[8px] font-bold transition-all ${noteConfig.shape === s ? 'border-blue-800 bg-blue-50 text-blue-800' : 'bg-white border-gray-100'}`}>

            {s}

          </button>

        ))}

      </div>

      <button type="button" onClick={() => setNoteConfig({ ...noteConfig, shape: 'none' })}

        className={`w-full p-2 border-2 border-black font-bold uppercase text-[10px] transition-all ${noteConfig.shape === 'none' ? 'bg-black text-white' : 'bg-white'}`}>

        Solo Texto

      </button>

    </div>



    {/* DERECHA: Toolbox + Preview */}

    <div className="flex-1 bg-gray-50 p-6 rounded-sm space-y-4 flex flex-col items-center">

      <div className="w-full flex justify-between items-center border-b pb-3">

        <label className="text-[10px] font-bold uppercase text-gray-400">Color Fondo Forma</label>

        <input type="color" className="h-6 w-8 border-none" value={noteConfig.bgColor}

          onChange={e => setNoteConfig({ ...noteConfig, bgColor: e.target.value })} />

      </div>



      <div className="w-full">

        <StyleControls styles={noteConfig} setStyles={setNoteConfig} label="Nota" />

      </div>



      {/* Canvas de preview */}

      <div className="mt-4 flex flex-col items-center gap-2">

        <p className="text-[8px] font-bold text-gray-400 uppercase">Vista Previa Real</p>

        <div className="border-2 border-white shadow-inner bg-gray-200 rounded-sm overflow-hidden">

          <canvas ref={previewCanvasRef} />

        </div>

      </div>



      <div className="flex gap-4 w-full mt-auto pt-4 border-t">

        <button type="button" onClick={closeNoteModal}

          className="flex-1 py-3 font-bold text-gray-400 uppercase text-xs">

          Cancelar

        </button>

        <button type="button" onClick={addNoteToCanvas}

          className="flex-1 py-3 bg-blue-900 text-white font-black rounded shadow-lg uppercase text-xs tracking-widest">

          Confirmar Nota

        </button>

      </div>

    </div>

  </div>

</div>

)}
      {showGallery && (
  <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
    <div className="bg-white w-full max-w-5xl p-8 rounded-sm shadow-2xl flex flex-col max-h-[90vh]">
      
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h3 className="text-2xl font-black text-blue-900 uppercase italic">Galería de Plantillas</h3>
        
        {/* BOTÓN CARGAR IMAGEN */}
        <div className="flex items-center gap-4">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/png, image/jpeg" 
            onChange={handleUploadBackground} 
          />
          <button 
            type="button" 
            onClick={() => fileInputRef.current.click()}
            className="bg-gold text-blue-900 px-4 py-2 rounded-sm font-black text-[10px] uppercase shadow-lg hover:bg-yellow-500 transition-all flex items-center gap-2"
          >
            <span>📁</span> Cargar Imagen
          </button>
          
          <button type="button" onClick={() => setShowGallery(false)} className="bg-red-50 text-red-600 px-4 py-2 font-bold hover:bg-red-600 hover:text-white transition-all">CERRAR X</button>
        </div>
      </div>

      <div className="overflow-y-auto pr-4 custom-scrollbar" style={{ flex: 1 }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="cursor-pointer border-2 border-dashed border-gray-300 flex flex-col items-center justify-center h-32 hover:border-blue-900 transition-all group bg-gray-50"

onClick={clearBackground}>

<span className="text-2xl opacity-30 group-hover:opacity-100 transition-opacity">🚫</span>

<p className="text-[10px] text-center mt-2 uppercase font-bold text-gray-400 group-hover:text-blue-900">Sin Plantilla (Blanco)</p>

</div>

          {/* Mapeo de templates */}
          {templates.map(temp => (
            <div key={temp.id} className="cursor-pointer border-2 hover:border-blue-900 p-1 group relative" onClick={() => applyTemplate(temp.url)}>
              <div className="aspect-video overflow-hidden">
                <img src={temp.url} alt={temp.name} className="w-full h-full object-cover" />
                {/* Indicador de imagen personalizada */}
                {temp.isCustom && (
                  <span className="absolute top-2 right-2 bg-blue-600 text-white text-[8px] px-1 font-bold rounded-sm">LOCAL</span>
                )}
              </div>
              <p className="text-[9px] text-center mt-2 uppercase font-black text-gray-500">{temp.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default CreatePostView;