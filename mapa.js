"use strict";
const mapNodes = [
    // Nivel 1
    {
        id: 'ROOT',
        label: 'Procesamiento por Lotes',
        desc: 'Un sistema en el que los trabajos se agrupan por requerimientos similares y se ejecutan secuencialmente sin interacción directa del usuario.',
        x: 2500, y: 200, isRoot: true
    },
    // Nivel 2
    {
        id: 'REP',
        label: 'Tareas Masivas y Repetitivas',
        desc: 'Paradigma fundamental para automatizar operaciones mecánicas y de inmenso volumen de datos, reduciendo drásticamente el error humano y los costos operativos.',
        x: 2500, y: 750
    },
    // Nivel 3 (Características Base y Agrupación de Apps)
    {
        id: 'OFF',
        label: 'Trabajos Offline',
        desc: 'El usuario prepara el trabajo y los datos en un dispositivo fuera de línea y lo entrega al operador. El sistema se encarga de todo el procesamiento en bloque.',
        x: 1300, y: 1350
    },
    {
        id: 'MON',
        label: 'Monitor de Lotes',
        desc: 'Programa residente en la parte baja de la memoria que gobierna y orquesta la ejecución de cada lote, garantizando el orden (generalmente FIFO).',
        x: 2100, y: 1350
    },
    {
        id: 'CPU',
        label: 'Eficiencia de CPU',
        desc: 'Prioriza mantener el procesador ocupado el mayor tiempo posible para maximizar el uso de recursos y reducir tiempos muertos en el servidor.',
        x: 2900, y: 1350
    },
    {
        id: 'USE',
        label: 'Casos de Uso Principales',
        desc: 'Sectores empresariales y científicos donde procesar datos individualmente sería ineficiente y muy costoso.',
        x: 3900, y: 1350
    },
    // Nivel 4 (Consecuencias y Aplicaciones)
    {
        id: 'LAT',
        label: 'Alta Latencia',
        desc: 'Existe un retraso natural e inevitable entre la recolección de los datos y el resultado obtenido. Inviable para reacción en tiempo real.',
        miniDiagram: 'latency',
        x: 1000, y: 2000
    },
    {
        id: 'ERR',
        label: 'Efecto Cascada',
        desc: 'Si un lote falla en una etapa temprana, todo el proceso posterior queda bloqueado. Difícil de depurar sin intervención humana.',
        miniDiagram: 'cascade',
        x: 1600, y: 2000
    },
    {
        id: 'PRC',
        label: 'Flujo de Ejecución',
        desc: 'La ejecución transita por 4 etapas vitales: Encolado, Formación del Lote, Ejecución por CPU, y Generación de Salida (Spooling).',
        isProcess: true,
        x: 2100, y: 2000
    },
    {
        id: 'RDT',
        label: 'Alto Throughput',
        desc: 'El rendimiento general se dispara ya que la máquina casi no pierde ciclos de reloj esperando inputs interactivos del usuario.',
        miniDiagram: 'throughput',
        x: 2900, y: 2000
    },
    {
        id: 'APP1',
        label: 'Banca y Finanzas',
        desc: 'Liquidación nocturna y conciliaciones.',
        appIcon: 'fa-building-columns',
        x: 3300, y: 2000
    },
    {
        id: 'APP4',
        label: 'Nómina',
        desc: 'Cálculo de salarios y generación de cobros.',
        appIcon: 'fa-file-invoice-dollar',
        x: 3700, y: 2000
    },
    {
        id: 'APP2',
        label: 'Logística y Retail',
        desc: 'Actualización masiva de inventarios.',
        appIcon: 'fa-truck-fast',
        x: 4100, y: 2000
    },
    {
        id: 'APP3',
        label: 'Ciencia',
        desc: 'Simulaciones climáticas y genómicas.',
        appIcon: 'fa-flask',
        x: 4500, y: 2000
    },
    // Nivel 5 (Tecnologías)
    {
        id: 'TEC1',
        label: 'Sistemas Mainframe',
        desc: 'Ecosistema clásico y ultra robusto como IBM z/OS con JCL. En entornos Unix equivalen a tareas automatizadas en cron o at.',
        x: 3500, y: 2700
    },
    {
        id: 'TEC2',
        label: 'Cloud y Big Data',
        desc: 'Soluciones en la nube como AWS Batch, o ecosistemas de procesamiento masivo distribuido como Apache Hadoop y Spark.',
        x: 4300, y: 2700
    }
];
const mapLinks = [
    { source: 'ROOT', target: 'REP' },
    { source: 'REP', target: 'OFF' },
    { source: 'REP', target: 'MON' },
    { source: 'REP', target: 'CPU' },
    { source: 'REP', target: 'USE' },
    { source: 'OFF', target: 'LAT' },
    { source: 'OFF', target: 'ERR' },
    { source: 'MON', target: 'PRC' },
    { source: 'CPU', target: 'RDT' },
    { source: 'USE', target: 'APP1' },
    { source: 'USE', target: 'APP4' },
    { source: 'USE', target: 'APP2' },
    { source: 'USE', target: 'APP3' },
    { source: 'APP1', target: 'TEC1' },
    { source: 'APP4', target: 'TEC1' },
    { source: 'APP2', target: 'TEC2' },
    { source: 'APP3', target: 'TEC2' }
];
document.addEventListener('DOMContentLoaded', () => {
    const nodesLayer = document.getElementById('nodes-layer');
    const svgLayer = document.getElementById('svg-layer');
    const viewport = document.getElementById('viewport');
    const mapContainer = document.getElementById('map-container');
    let pz;
    mapNodes.forEach(node => {
        const div = document.createElement('div');
        div.className = node.isRoot ? 'node root' : (node.appIcon ? 'node app-node' : 'node');
        div.id = node.id;
        div.style.left = `${node.x}px`;
        div.style.top = `${node.y}px`;
        let innerHTML = '';
        if (node.appIcon) {
            innerHTML += `<i class="fa-solid ${node.appIcon}" style="font-size: 32px; color: #1e40af; margin-bottom: 15px;"></i>`;
        }
        if (node.isRoot) {
            innerHTML += `<h2>${node.label}</h2><p>${node.desc}</p>`;
        }
        else {
            innerHTML += `<h3>${node.label}</h3><p>${node.desc}</p>`;
        }
        // Mini Diagramas e Interactividad
        if (node.miniDiagram === 'latency') {
            innerHTML += `
            <div class="mini-diagram latency-diagram">
                <div class="lat-track"></div>
                <div class="lat-point start"></div>
                <div class="lat-point end"></div>
                <div class="lat-labels">
                    <span>Dato</span>
                    <span>Resultado</span>
                </div>
            </div>`;
        }
        else if (node.miniDiagram === 'cascade') {
            innerHTML += `
            <div class="mini-diagram cascade-diagram">
                <div class="cascade-track"></div>
                <div class="cascade-row">
                    <div class="cascade-box error"><i class="fa-solid fa-xmark"></i></div>
                    <div class="cascade-box locked"><i class="fa-solid fa-lock"></i></div>
                    <div class="cascade-box locked"><i class="fa-solid fa-lock"></i></div>
                    <div class="cascade-box locked"><i class="fa-solid fa-lock"></i></div>
                </div>
            </div>
            <div class="cascade-label">Bloqueado tras el primer fallo</div>`;
        }
        else if (node.miniDiagram === 'throughput') {
            innerHTML += `
            <div class="mini-diagram throughput-diagram">
                <div class="th-row">
                    <div class="th-label">Batch <span>92%</span></div>
                    <div class="th-bar"><div class="th-fill batch" style="width: 92%"></div></div>
                </div>
                <div class="th-row">
                    <div class="th-label">Interactivo <span>28%</span></div>
                    <div class="th-bar"><div class="th-fill interactive" style="width: 28%"></div></div>
                </div>
            </div>`;
        }
        else if (node.isProcess) {
            innerHTML += `
            <div class="process-animation">
                <div class="process-track"></div>
                <div class="job-box job-1"></div>
                <div class="job-box job-2"></div>
                <div class="job-box job-3"></div>
                <div class="process-labels">
                    <span>Cola</span><span>Lote</span><span>CPU</span><span>Salida</span>
                </div>
            </div>`;
        }
        div.innerHTML = innerHTML;
        div.addEventListener('click', (e) => {
            e.stopPropagation();
            focusOnNode(node.id);
        });
        nodesLayer.appendChild(div);
    });
    setTimeout(() => {
        mapLinks.forEach(link => {
            const sourceNode = mapNodes.find(n => n.id === link.source);
            const targetNode = mapNodes.find(n => n.id === link.target);
            if (sourceNode && targetNode) {
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                const parentEl = document.getElementById(sourceNode.id);
                const childEl = document.getElementById(targetNode.id);
                if (parentEl && childEl) {
                    const startY = sourceNode.y + (parentEl.offsetHeight / 2) + 5;
                    const endY = targetNode.y - (childEl.offsetHeight / 2) - 5;
                    const controlOffset = Math.abs(endY - startY) * 0.4;
                    const d = `M ${sourceNode.x} ${startY} C ${sourceNode.x} ${startY + controlOffset}, ${targetNode.x} ${endY - controlOffset}, ${targetNode.x} ${endY}`;
                    path.setAttribute('d', d);
                    path.setAttribute('class', 'connector');
                    path.setAttribute('marker-end', 'url(#arrow)');
                    svgLayer.appendChild(path);
                }
            }
        });
        pz = Panzoom(mapContainer, {
            maxScale: 3,
            minScale: 0.1,
            step: 0.1,
            excludeClass: 'apple-btn'
        });
        viewport.addEventListener('wheel', pz.zoomWithWheel);
        setTimeout(() => focusOnNode('ROOT', true), 50);
    }, 150);
    function focusOnNode(id, instant = false) {
        const node = mapNodes.find(n => n.id === id);
        if (!node)
            return;
        const w = window.innerWidth;
        const h = window.innerHeight;
        // Ajustes responsivos
        let responsiveScale = 1;
        if (w < 768) {
            responsiveScale = 0.85;
        }
        else if (w < 1024) {
            responsiveScale = 0.9;
        }
        const baseTarget = id === 'ROOT' ? 0.85 : 1.1;
        const targetScale = baseTarget * responsiveScale;
        // Valores fijos del contenedor (6000x4500)
        const cx = 3000;
        const cy = 2250;
        let targetScreenX = w / 2;
        let targetScreenY = h / 2;
        if (w < 768 && id === 'ROOT') {
            targetScreenY = 160;
        }
        const screenPanX = targetScreenX - cx * (1 - targetScale) - (node.x * targetScale);
        const screenPanY = targetScreenY - cy * (1 - targetScale) - (node.y * targetScale);
        pz.zoom(targetScale, { animate: !instant, duration: 600 });
        pz.pan(screenPanX / targetScale, screenPanY / targetScale, { animate: !instant, duration: 600, easing: 'cubic-bezier(0.25, 1, 0.5, 1)' });
    }
    function focusWholeMap() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        // Escala más pequeña para asegurar que todo (1000 a 4500) se vea en pantalla
        const scale = w < 768 ? 0.15 : 0.22;
        const cx = 3000;
        const cy = 2250;
        const contentX = 2750;
        const contentY = 1450;
        const screenPanX = (w / 2) - cx * (1 - scale) - (contentX * scale);
        const screenPanY = (h / 2) - cy * (1 - scale) - (contentY * scale);
        pz.zoom(scale, { animate: true, duration: 600 });
        pz.pan(screenPanX / scale, screenPanY / scale, { animate: true, duration: 600, easing: 'cubic-bezier(0.25, 1, 0.5, 1)' });
    }
    function manualZoom(factor) {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const S0 = pz.getScale();
        let S1 = S0 * factor;
        if (S1 > 3)
            S1 = 3;
        if (S1 < 0.1)
            S1 = 0.1;
        const currentPan = pz.getPan();
        const cx = 3000;
        const cy = 2250;
        const targetScreenX = w / 2;
        const targetScreenY = h / 2;
        const panX_new = currentPan.x + (targetScreenX - cx) * (1 / S1 - 1 / S0);
        const panY_new = currentPan.y + (targetScreenY - cy) * (1 / S1 - 1 / S0);
        pz.zoom(S1, { animate: true, duration: 300 });
        pz.pan(panX_new, panY_new, { animate: true, duration: 300 });
    }
    document.getElementById('zoom-in')?.addEventListener('click', () => manualZoom(1.3));
    document.getElementById('zoom-out')?.addEventListener('click', () => manualZoom(0.7));
    document.getElementById('reset')?.addEventListener('click', () => {
        focusWholeMap();
    });
    const refModal = document.getElementById('ref-modal');
    document.getElementById('btn-references')?.addEventListener('click', () => refModal.classList.add('active'));
    document.getElementById('close-modal')?.addEventListener('click', () => refModal.classList.remove('active'));
    refModal.addEventListener('click', (e) => { if (e.target === refModal)
        refModal.classList.remove('active'); });
});
