// piano_editor.js
// ============================================
// EDITOR DE PIANO - FUNÇÕES COMPLETAS
// ============================================

const escalaPadrao = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
let becomeSelecPiano = [];
let diagramasPiano = [];
deixe diagramaPianoSelecionado = null;
let filtroPiano = "";
let clefAtualPiano = "treble";

// ============================================
// FUNÇÕES AUXILIARES
// ============================================
function notaParaNum(letra, acidental, oitava) {
    deixe base = escalaPadrao.indexOf(letra);
    deixe offset = acidental === "^" ? 1: acidental === "_" ? -1: 0;
    return (parseInt(oitava) + 1) * 12 + base + deslocamento;
}

função numParaNota(num) {
    retornar escalaPadrao[num % 12] + (Math.floor(num / 12) - 1);
}

função formatarCifra(acc, char) {
    se (acc === "^") retornar char + "#";
    se (acc === "_") retornar char + "b";
    retornar char;
}

function oitavaParaABCNome(notaChar, oitava) {
    let letra = notaChar;
    if (oitava === 2) return letra + ",,0";
    if (oitava === 3) return letra + ",0";
    if (oitava === 4) return letra + "0";
    if (oitava === 5) return letra.toLowerCase() + "0";
    if (oitava === 6) return letra.toLowerCase() + "'0";
    if (oitava === 7) return letra.toLowerCase() + "''0";
    if (oitava === 1) return letra + ",,,0";
    return letra + (oitava - 4) + "0";
}

função abcParaOitava(notaStr) {
    let match = notaStr.match(/^([\^_]?)([A-Ga-g])([,']*)(\d+)$/);
    se (!match) retorne nulo;
    seja acc = match[1];
    let letra = match[2].toUpperCase();
    let terrares = match[3];
    seja oitava = 4;
    if (modificadores.includes(',')) {
        deixe vírgulas = (modificadores.match(/,/g) || []).length;
        oitava = 4 - vírgulas;
    } else if (modificadores.includes("'")) {
        deixe apóstrofes = (modificadores.match(/'/g) || []).length;
        oitava = 5 + apóstrofos;
    } else if (letra !== match[2]) {
        oitava = 5;
    }
    return { acc, letra, oitava, num: notaParaNum(letra, acc, oitava) };
}

função escapeHtml(texto) {
    return text.replace(/[&<>]/g, function(m) {
        se (m === '&') retorne '&';
        se (m === '<') retorne '<';
        se (m === '>') retorne '>';
        retornar m;
    });
}

função toast(msg, tipo) {
    let t = document.createElement("div");
    t.textContent = msg;
    let bgColor = tipo === 'success' ? '#2ed573' : (tipo === 'warning' ? '#ffa502' : '#3a86ff');
    t.style.cssText = `position:fixed; bottom:20px; right:20px; background:${bgColor}; color:white; padding:12px 20px; border-radius:8px; z-index:9999; animation:fadeOut 3s forwards; font-weight:bold;`;
    documento.corpo.appendChild(t);
    setTimeout(() => t.remove(), 3000);
}

// ============================================
// CONTROLE DE CHAVE
// ============================================
função setClefModePiano(clef) {
    claveAtualPiano = clave;
    const trebleBtn = document.getElementById("clefTrebleBtn");
    const bassBtn = document.getElementById("clefBassBtn");
    const modeLabel = document.getElementById("clefModeLabel");
    
    se (trebleBtn) trebleBtn.classList.remove("ativo");
    if (bassBtn) bassBtn.classList.remove("active");
    
    se (clave === "sol") {
        se (trebleBtn) trebleBtn.classList.add("ativo");
        se (rótulo do modo) {
            modeLabel.innerHTML = "🔵 Clave de Sol";
            modeLabel.className = "clef-indicator treble";
        }
    } outro {
        se (bassBtn) bassBtn.classList.add("ativo");
        se (rótulo do modo) {
            modeLabel.innerHTML = "🟢 Clave de Fá";
            modeLabel.className = "indicador de clave baixo";
        }
    }
}

// ============================================
// CRIAR TECLADO
// ============================================
função criarTecladoPiano() {
    const kb = document.getElementById("keyboard");
    se (!kb) retornar;
    
    kb.innerHTML = "";
    deixe startNota = document.getElementById("startNota")?.value || “C3”;
    let endNota = document.getElementById("endNota")?.value || "C5";
    
    deixe startMatch = startNota.match(/^([AG])(\d+)$/);
    let endMatch = endNota.match(/^([AG])(\d+)$/);
    
    if (!startMatch || !endMatch) retornar;
    
    const startNum = notaParaNum(startMatch[1], "", startMatch[2]);
    const endNum = notaParaNum(endMatch[1], "", endMatch[2]);
    const zoom = parseInt(document.getElementById("zoomPiano")?.value || 30);
    const w = zoom;
    const h = w * 4.5;
    
    seja brancos = {};
    for (seja i = startNum; i <= endNum; i++) {
        seja n = numParaNota(i);
        se (!n.inclui("#")) {
            let k = document.createElement("div");
            k.className = "branco";
            k.dataset.nota = i;
            k.onclick = () => toggleNotaPiano(i);
            k.innerHTML = `<div class="noteLabel">${n}</div>`;
            k.style.width = w + "px";
            k.style.height = h + "px";
            k.style.display = "inline-block";
            k.style.position = "relativo";
            k.style.cursor = "ponteiro";
            kb.appendChild(k);
            brancos[i] = k;
        }
    }
    
    for (seja i = startNum; i <= endNum; i++) {
        seja n = numParaNota(i);
        se (n.inclui("#")) {
            seja p = brancos[i-1];
            if (p && p.parentNode === kb) {
                let b = document.createElement("div");
                b.className = "preto";
                b.dataset.nota = i;
                b.style.width = (w * 0.65) + "px";
                b.style.height = (h * 0.6) + "px";
                b.style.left = (w * 0.68) + "px";
                b.style.top = "0";
                b.style.position = "absoluto";
                b.style.backgroundColor = "#222";
                b.onclick = (e) => { e.stopPropagation(); toggleNotaPiano(i); };
                p.appendChild(b);
            }
        }
    }
}

função toggleNotaPiano(num) {
    deixe existente = notasSelecPiano.find(n => n.num === num && n.clef === clefAtualPiano);
    se (existente) {
        notasSelecPiano = notasSelecPiano.filter(n => !(n.num === num && n.clef === clefAtualPiano));
    } outro {
        deixe notaBase = escalaPadrao[num % 12];
        deixe oitava = Math.floor(num / 12) - 1;
        let char = notaBase[0];
        let acc = notaBase.includes("#") ? "^" : "";
        notasSelecPiano.push({num, char, acc, oitava, clave: clefAtualPiano});
    }
    notasSelecPiano.sort((a, b) => a.num - b.num);
    atualizarCoresTecladoPiano();
    gerarABCPiano();
}

function atualizarCoresTecladoPiano() {
    document.querySelectorAll("#keyboard .white, #keyboard .black").forEach(el => {
        el.classList.remove("activeWhiteTreble", "activeBlackTreble", "activeWhiteBass", "activeBlackBass");
    });
    notasSelecPiano.forEach(nota => {
        let tecla = document.querySelector(`#keyboard [data-nota="${nota.num}"]`);
        se (tecla) {
            se (nota.clef === "sol") {
                tecla.classList.add(tecla.classList.contains("white") ? "activeWhiteTreble" : "activeBlackTreble");
            } outro {
                tecla.classList.add(tecla.classList.contains("white") ? "activeWhiteBass" : "activeBlackBass");
            }
        }
    });
}

função gerarABCPiano() {
    let notasTreble = notasSelecPiano.filter(n => n.clef === "treble");
    let notasBass = notasSelecPiano.filter(n => n.clef === "bass");
    
    let trebleNotes = notasTreble.map(n => {
        seja nota = n.char;
        se (n.acc === "^") nota = "^" + n.char;
        senão se (n.acc === "_") nota = "_" + n.char;
        return oitavaParaABCNome(nota.replace(/[\^_]/g, ''), n.oitava);
    }).juntar(" ");
    
    let bassNotes = notasBass.map(n => {
        seja nota = n.char;
        se (n.acc === "^") nota = "^" + n.char;
        senão se (n.acc === "_") nota = "_" + n.char;
        return oitavaParaABCNome(nota.replace(/[\^_]/g, ''), n.oitava);
    }).juntar(" ");
    
    let abcString = `X:1\nK:C\nV:1 clave=sol\n[${trebleNotes || "z"}]|]\nV:2 clave=fá\n[${bassNotes || "z"}]|]`;
    let abcField = document.getElementById("abcTextPiano");
    se (abcField) abcField.value = abcString;
    atualizarEditorPiano();
}

function sincronizarDoABCPiano() {
    deixe texto = document.getElementById("abcTextPiano")?.value || "";
    deixe trebleMatch = texto.match(/V:1[^\n]*\n\[(.*?)\]/);
    deixe bassMatch = texto.match(/V:2[^\n]*\n\[(.*?)\]/);
    
    concederSelecPiano = [];
    
    se (trebleMatch) {
        let notasRaw = trebleMatch[1];
        let regex = /([\^_]?)([A-Ga-g][,']*\d+)/g;
        seja m;
        enquanto ((m = regex.exec(notasRaw)) !== null) {
            seja acc = m[1];
            seja notaCompleta = m[2];
            let resultado = abcParaOitava(notaCompleta);
            se (resultado) {
                deixe num = notaParaNum(resultado.letra, acc || resultado.acc, resultado.oitava);
                notasSelecPiano.push({num, char: resultado.letra, acc: acc || resultado.acc, oitava: resultado.oitava, clave: "treble"});
            }
        }
    }
    
    se (bassMatch) {
        let notasRaw = bassMatch[1];
        let regex = /([\^_]?)([A-Ga-g][,']*\d+)/g;
        seja m;
        enquanto ((m = regex.exec(notasRaw)) !== null) {
            seja acc = m[1];
            seja notaCompleta = m[2];
            let resultado = abcParaOitava(notaCompleta);
            se (resultado) {
                deixe num = notaParaNum(resultado.letra, acc || resultado.acc, resultado.oitava);
                notasSelecPiano.push({num, char: resultado.letra, acc: acc || resultado.acc, oitava: resultado.oitava, clave: "baixo"});
            }
        }
    }
    
    notasSelecPiano.sort((a, b) => a.num - b.num);
    atualizarCoresTecladoPiano();
    atualizarEditorPiano();
}

function atualizarEditorPiano() {
    deixe startNota = document.getElementById("startNota")?.value || “C3”;
    let endNota = document.getElementById("endNota")?.value || "C5";
    let zoom = parseInt(document.getElementById("zoomPiano")?.value || 30);
    let fingersTreble = document.getElementById("fingersTreble")?.value || "1 3 5";
    let fingersBass = document.getElementById("fingersBass")?.value || "5 3 1";
    
    desenharDiagramaPiano(document.getElementById("preview-diagram-piano"), notasSelecPiano, startNota, endNota, zoom, dedosTreble, dedosBass);
    renderizarPartituraPiano(document.getElementById("preview-score-piano"), document.getElementById("abcTextPiano")?.value);
}

function desenharDiagramaPiano(container, notas, start, end, zoom, fingersTreble, fingersBass) {
    se (!container) retornar;
    container.innerHTML = "";
    
    deixe startMatch = start.match(/^([AG])(\d+)$/);
    let endMatch = end.match(/^([AG])(\d+)$/);
    if (!startMatch || !endMatch) retornar;
    
    const startNum = notaParaNum(startMatch[1], "", startMatch[2]);
    const endNum = notaParaNum(endMatch[1], "", endMatch[2]);
    const w = zoom;
    const h = w * 4.5;
    
    let fingersTrebleArr = fingersTreble.trim().split(/\s+/).filter(d => d !== '');
    let fingersBassArr = fingersBass.trim().split(/\s+/).filter(d => d !== '');
    
    let wrap = document.createElement("div");
    wrap.style.width = "100%";
    wrap.style.display = "flex";
    wrap.style.justifyContent = "center";
    
    let keyboardContainer = document.createElement("div");
    keyboardContainer.style.position = "relative";
    keyboardContainer.style.display = "inline-block";
    keyboardContainer.style.height = (h + 8) + "px";
    
    seja brancos = {};
    for (seja i = startNum; i <= endNum; i++) {
        seja notaPura = numParaNota(i);
        se (!notaPura.include("#")) {
            let k = document.createElement("div");
            k.style.width = w + "px";
            k.style.height = h + "px";
            k.style.backgroundColor = "#fff";
            k.style.display = "inline-block";
            k.style.position = "relativo";
            k.style.border = "1px solid #999";
            k.style.borderRadius = "0 0 4px 4px";
            
            let nSel = notas.find(ns => ns.num === i);
            se (nSel) {
                deixe corFundo = nSel.clef === "treble" ? "#d0e7ff" : "#d4f1e6";
                k.style.background = corFundo;
                let notasMesmaClef = notas.filter(n => n.clef === nSel.clef);
                let index = notasMesmaClef.findIndex(n => n.num === i);
                deixe cifra = formatarCifra(nSel.acc, nSel.char);
                let dedoNum = nSel.clef === "treble" ? fingersTrebleArr[index] : fingersBassArr[index];
                seja circuloSiz = Math.max(16, w * 0.38);
                let fontSize = Math.max(10, w * 0.32);
                let corDedo = nSel.clef === "treble" ? "#ff4757" : "#e67e22";
                
                k.innerHTML = `<div style="position:absolute; width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:flex-end; bottom:10px; left:0;">
                    <div style="display:flex; flex-direction:column; align-items:center; gap:2px;">
                        ${dedoNum ? `<div style="width:${circuloSiz}px; height:${circuloSiz}px; font-size:${fontSize}px; background:${corDedo}; color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold;">${dedoNum}</div>` : ''}
                        <div style="font-weight:bold; font-size:${fontSize}px; background:rgba(255,255,255,0.9); padding:1px 4px; border-radius:3px;">${cifra}</div>
                    </div>
                </div>`;
            }
            keyboardContainer.appendChild(k);
            brancos[i] = k;
        }
    }
    
    for (seja i = startNum; i <= endNum; i++) {
        seja notaPura = numParaNota(i);
        se (notaPura.includes("#")) {
            seja p = brancos[i-1];
            se (p && p.parentNode === keyboardContainer) {
                let b = document.createElement("div");
                b.style.width = (w * 0.65) + "px";
                b.style.height = (h * 0.6) + "px";
                b.style.left = (w * 0.68) + "px";
                b.style.top = "0";
                b.style.position = "absoluto";
                b.style.backgroundColor = "#222";
                b.style.borderRadius = "0 0 3px 3px";
                
                let nSel = notas.find(ns => ns.num === i);
                se (nSel) {
                    let corFundo = nSel.clef === "treble" ? "#3a86ff" : "#2ecc71";
                    b.style.background = corFundo;
                    let notasMesmaClef = notas.filter(n => n.clef === nSel.clef);
                    let index = notasMesmaClef.findIndex(n => n.num === i);
                    deixe cifra = formatarCifra(nSel.acc, nSel.char);
                    let dedoNum = nSel.clef === "treble" ? fingersTrebleArr[index] : fingersBassArr[index];
                    seja circuloSiz = Math.max(14, w * 0.33);
                    let fontSize = Math.max(9, w * 0.28);
                    
                    b.innerHTML = `<div style="position:absolute; width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:flex-end; bottom:4px; left:0;">
                        <div style="display:flex; flex-direction:column; align-items:center; gap:1px;">
                            ${dedoNum ? `<div style="width:${circuloSiz}px; height:${circuloSiz}px; font-size:${fontSize}px; background:#ff4757; color:white; border-radius:50%; display:flex; align-items:center; justify-content:center;">${dedoNum}</div>` : ''}
                            <div style="font-weight:bold; font-size:${fontSize}px; color:white; text-shadow:0 1px 1px black;">${cifra}</div>
                        </div>
                    </div>`;
                }
                p.style.position = "relativo";
                p.appendChild(b);
            }
        }
    }
    
    wrap.appendChild(keyboardContainer);
    container.appendChild(wrap);
}

function renderizarPartituraPiano(container, abcTexto) {
    se (!container) retornar;
    container.innerHTML = "";
    se (!abcTexto || !abcTexto.trim()) retorne;
    tentar {
        let wrapper = document.createElement("div");
        wrapper.className = "dual-stave";
        ABCJS.renderAbc(wrapper, abcTexto, {
            largura da equipe: 300,
            escala: 1,0,
            acolchoamento superior: 1,
            paddingbottom: 28,
            adicionar_classes: verdadeiro
        });
        container.appendChild(wrapper);
    } catch(e) {
        container.innerHTML = "<small style='color:red'>Erro na partitura</small>";
    }
}

// ============================================
// IDENTIFICAR SIGLA DO ACORDE PELAS NOTAS
// ============================================
function identificarSiglaAcorde(notas) {
    const notasSelecionadas = notas.map(n => {
        seja nota = n.char;
        se (n.acc === "^") nota += "#";
        senão se (n.acc === "_") nota += "b";
        retornar nota;
    }).organizar();
    
    se (typeof ACORDES_PIANO === 'undefined') retorne nulo;
    
    for (const [sigla, acorde] de Object.entries(ACORDES_PIANO)) {
        const notasAcorde = [...acorde.notas].sort();
        if (JSON.stringify(notasSelecionadas) === JSON.stringify(notasAcorde)) {
            retornar sigla;
        }
    }
    retornar nulo;
}

// ============================================
// GERAÇÃO DE DIAGRAMAS
// ============================================
function adicionarDiagramaPiano() {
    deixe nome = document.getElementById("diagramNamePiano")?.value.trim() || “Sem nome”;
    se (notasSelecPiano.length === 0) {
        brinde("Selecione pelo menos uma nota!", "aviso");
        retornar;
    }
    
    const siglaIdentificada = identificarSiglaAcorde(notasSelecPiano);
    
    diagramasPiano.push({
        id: Date.now(),
        nome: nome,
        sigla: siglaIdentificada || nulo,
        startNota: document.getElementById("startNota")?.value || "C3",
        endNota: document.getElementById("endNota")?.value || "C5",
        zoom: parseInt(document.getElementById("zoomPiano")?.value || 30),
        fingersTreble: document.getElementById("fingersTreble")?.value || "1 3 5",
        fingersBass: document.getElementById("fingersBass")?.value || "5 3 1",
        abc: document.getElementById("abcTextPiano")?.value || "",
        notas: JSON.parse(JSON.stringify(notasSelecPiano))
    });
    
    salvarDiagramasPiano();
    renderizarListaPiano();
    brinde("✅ Diagrama de piano adicionado!", "sucesso");
}

função renderizarListaPiano() {
    let list = document.getElementById("diagramsListPiano");
    se (!lista) retornar;
    
    deixe filtrados = filtroPiano ? diagramasPiano.filter(d => d.nome.toLowerCase().includes(filtroPiano)) : diagramasPiano;
    let countSpan = document.getElementById("diagramCountPiano");
    se (countSpan) countSpan.innerHTML = filtrados.length;
    
    lista.innerHTML = "";
    
    se (filtrados.length === 0) {
        list.innerHTML = '<div style="text-align:center; padding:30px; color:#999;">📭 Nenhum diagrama de piano</div>';
        retornar;
    }
    
    filtrados.forEach(diag => {
        let div = document.createElement("div");
        div.className = `diagram-item ${diagramaPianoSelecionado === diag.id ? 'selected' : ''}`;
        div.onclick = () => { diagramaPianoSelecionado = diag.id; renderizarListaPiano(); brinde(`📌 ${diag.nome} selecionado`, "info"); };
        div.innerHTML = `
            <div class="diagram-header">
                <span class="diagram-name">🎹 ${escapeHtml(diag.nome)}</span>
                <div class="diagram-actions">
                    <button onclick="event.stopPropagation();editarDiagramaPiano(${diag.id})">✏️</button>
                    <button onclick="event.stopPropagation();removerDiagramaPiano(${diag.id})">🗑️</button>
                </div>
            </div>
            <div class="diagram-info">
                <span>${diag.notas.filter(n=>n.clef==='treble').length} Sol / ${diag.notas.filter(n=>n.clef==='bass').length} Fá</span>
                ${diag.sigla ? `<span style="background:#667eea; color:white; padding:2px 8px; border-radius:12px; font-size:11px;">${diag.sigla}</span>` : ''}
            </div>
        `;
        lista.appendChild(div);
    });
}

function editarDiagramaPiano(id) {
    let diag = diagramasPiano.find(d => d.id === id);
    se (diag) {
        document.getElementById("diagramNamePiano").value = diag.nome;
        document.getElementById("startNota").value = diag.startNota;
        document.getElementById("endNota").value = diag.endNota;
        document.getElementById("zoomPiano").value = diag.zoom;
        document.getElementById("zoomPianoVal").innerText = diag.zoom;
        document.getElementById("fingersTreble").value = diag.fingersTreble;
        document.getElementById("fingersBass").value = diag.fingersBass;
        document.getElementById("abcTextPiano").value = diag.abc;
        notasSelecPiano = JSON.parse(JSON.stringify(diag.notas));
        atualizarCoresTecladoPiano();
        atualizarEditorPiano();
        brinde(`✏️ Editando: ${diag.nome}`, "info");
    }
}

função removerDiagramaPiano(id) {
    diagramasPiano = diagramasPiano.filter(d => d.id !== id);
    if (diagramaPianoSelecionado === id) diagramaPianoSelecionado = null;
    salvarDiagramasPiano();
    renderizarListaPiano();
    toast("🗑️ Removido", "sucesso");
}

função moverParaCimaPiano() {
    if (!diagramaPianoSelecionado) { brinde("Selecione um diagrama!", "warning"); retornar; }
    let idx = diagramasPiano.findIndex(d => d.id === diagramaPianoSelecionado);
    se (idx > 0) {
        [diagramasPiano[idx], diagramasPiano[idx-1]] = [diagramasPiano[idx-1], diagramasPiano[idx]];
        salvarDiagramasPiano();
        renderizarListaPiano();
        brinde("⬆️ Movido", "sucesso");
    }
}

função moverParaBaixoPiano() {
    if (!diagramaPianoSelecionado) { brinde("Selecione um diagrama!", "warning"); retornar; }
    let idx = diagramasPiano.findIndex(d => d.id === diagramaPianoSelecionado);
    se (idx < diagramasPiano.length - 1) {
        [diagramasPiano[idx], diagramasPiano[idx+1]] = [diagramasPiano[idx+1], diagramasPiano[idx]];
        salvarDiagramasPiano();
        renderizarListaPiano();
        toast("⬇️ Movido", "sucesso");
    }
}

function limparEditorPiano() {
    concederSelecPiano = [];
    document.getElementById("diagramaNomePiano").value = "Novo Acorde Piano";
    document.getElementById("fingersTreble").value = "1 3 5";
    document.getElementById("fingersBass").value = "5 3 1";
    document.getElementById("abcTextPiano").value = "";
    atualizarCoresTecladoPiano();
    atualizarEditorPiano();
    brinde("🧹Editor limpo", "info");
}

function limparTodosDiagramasPiano() {
    if (confirm("Remover TODOS os diagramas de piano?")) {
        diagramasPiano = [];
        diagramaPianoSelecionado = null;
        salvarDiagramasPiano();
        renderizarListaPiano();
        brinde("🗑️ Todos removidos", "sucesso");
    }
}

função filtrarDiagramasPiano() {
    filtroPiano = document.getElementById("searchDiagramsPiano")?.value.toLowerCase() || "";
    renderizarListaPiano();
}

função salvarDiagramasPiano() {
    localStorage.setItem("diagramas_piano", JSON.stringify(diagramasPiano));
}

function CarregarDiagramasPiano() {
    deixe salvos = localStorage.getItem("diagramas_piano");
    se (salvos) {
        diagramasPiano = JSON.parse(salvos);
        renderizarListaPiano();
    }
}

função gerarCódigoPianoParaEditor() {
    se (notasSelecPiano.length === 0) {
        brinde("⚠️ Selecione pelo menos uma nota primeiro!", "warning");
        retornar;
    }
    
    const nome = document.getElementById("diagramaNomePiano")?.value.trim() || "Meu Acordo";
    const startNota = document.getElementById("startNota")?.valor || “C3”;
    const endNota = document.getElementById("endNota")?.value || "C5";
    const fingersTreble = document.getElementById("fingersTreble")?.value || "";
    const fingersBass = document.getElementById("fingersBass")?.value || "";
    
    // Separar recemos por mão
    const notasTreble = notasSelecPiano.filter(n => n.clef === "treble");
    const notasBass = notasSelecPiano.filter(n => n.clef === "bass");
    
    // Extrair as notas selecionadas com oitava
    const todasNotas = notasSelecPiano.map(n => {
        seja nota = n.char;
        se (n.acc === "^") nota += "#";
        senão se (n.acc === "_") nota += "b";
        retornar nota + n.oitava;
    });
    
    // Extrair apenas os nomes das notas (sem oitava) para comparação
    const nomesNotas = todasNotas.map(n => n.replace(/[0-9]/g, ''));
    
    // Formatar notasTreble e notasBass para salvar
    const notasTrebleStr = notasTreble.map(n => {
        seja nota = n.char;
        se (n.acc === "^") nota += "#";
        senão se (n.acc === "_") nota += "b";
        retornar nota + n.oitava;
    });
    
    const notasBassStr = notasBass.map(n => {
        seja nota = n.char;
        se (n.acc === "^") nota += "#";
        senão se (n.acc === "_") nota += "b";
        retornar nota + n.oitava;
    });
    
    // Criar uma sigla única
    const siglaPersonalizada = "CUSTOM_" + todasNotas.join("_");
    
    // Salvar todas as informações
    const acordesPersonalizados = JSON.parse(localStorage.getItem("acordes_piano_personalizados") || "{}");
    acordesPersonalizados[siglaPersonalizada] = {
        nome: nome,
        notas: todasNotas,
        notasNomes: notasNotas,
        notasTreble: notasTrebleStr,
        notasBass: notasBassStr,
        startOitava: startNota,
        endOitava: endNota,
        dedosAgudos: dedosAgudos,
        fingersBass: fingersBass,
        dados: novo Date().toISOString()
    };
    localStorage.setItem("acordes_piano_personalizados", JSON.stringify(acordesPersonalizados));
    
    // Gerar o código
    const codigo = `[PIANO-CUSTOM:${siglaPersonalizada}]${nome}[/PIANO-CUSTOM]`;
    
    const editorField = document.getElementById('editor');
    const start = editorField.selectionStart;
    editorField.value = editorField.value.substring(0, start) + codigo + editorField.value.substring(start);
    editorField.selectionStart = editorField.selectionEnd = start + codigo.length;
    
    if (typeof renderizar === 'função') renderizar();
    se (typeof salvarAulaAtual === 'function') salvarAulaAtual();
    
    brinde(`✅ Acorde personalizado gerado!`, "sucesso");
}

// ============================================
// FUNÇÕES DE LAYOUT E EXPORTAÇÃO
// ============================================
função gerarLayoutPiano() {
    let cols = parseInt(document.getElementById("columnsPiano")?.value || 2);
    let rows = parseInt(document.getElementById("rowsPiano")?.value || 3);
    let gap = parseInt(document.getElementById("gapPiano")?.value || 12);
    seja porPagina = cols * rows;
    deixe container = document.getElementById("pianoContainer");
    let previewDiv = document.getElementById("previewPiano");
    
    se (!container) retornar;
    container.innerHTML = "";
    
    se (diagramasPiano.length === 0) {
        se (previewDiv) previewDiv.style.display = "nenhum";
        retornar;
    }
    
    se (previewDiv) previewDiv.style.display = "block";
    deixe paginas = Math.ceil(diagramasPiano.length / porPagina);
    
    for (seja p = 0; p < páginas; p++) {
        let page = document.createElement("div");
        page.style.cssText = `quebra de página depois: ${p === páginas-1 ? 'auto': 'sempre'}; break-after: ${p === páginas-1 ? 'auto': 'página'}; margem: 0; preenchimento: 8px 0;`;
        
        let titulo = document.createElement("div");
        titulo.style.cssText = "text-align:center; margin-bottom:12px; padding:6px; background:#f0f2f5; border-radius:6px; font-size:12px;";
        titulo.innerHTML = `<span style="font-weight:bold; color:#667eea;">Página ${p + 1} de ${paginas}</span>`;
        página.appendChild(título);
        
        let grid = document.createElement("div");
        grid.style.cssText = `display: grid; grid-template-columns: repeat(${cols}, 1fr); gap: ${gap}px; align-items: stretch;`;
        
        seja inicio = p * porPagina;
        deixe fim = Math.min(inicio + porPagina, diagramasPiano.length);
        
        para (seja i = início; i < fim; i++) {
            seja diag = diagramasPiano[i];
            let card = document.createElement("div");
            card.className = "diagram-card";
            
            let titleDiv = document.createElement("div");
            titleDiv.className = "título-do-diagrama";
            titleDiv.textContent = diag.nome;
            
            let contentDiv = document.createElement("div");
            contentDiv.className = "diagram-content";
            
            let diagramDiv = document.createElement("div");
            let scoreDiv = document.createElement("div");
            scoreDiv.className = "score-wrapper";
            
            // Usar a sigla salva para desenhar o acorde corretamente
            if (diag.sigla && typeof desenharAcordePianoPreview !== 'indefinido') {
                const tempContainer = document.createElement('div');
                desenharAcordePianoPreview(tempContainer, diag.sigla, diag.nome);
                diagramaDiv.innerHTML = tempContainer.innerHTML;
            } outro {
                desenharDiagramaPiano(diagramDiv, diag.notas, diag.startNota, diag.endNota, diag.zoom, diag.fingersTreble, diag.fingersBass);
            }
            
            contentDiv.appendChild(diagramDiv);
            
            se (diag.abc && diag.abc.trim()) {
                tentar {
                    let wrapper = document.createElement("div");
                    wrapper.className = "dual-stave";
                    ABCJS.renderAbc(wrapper, diag.abc, { staffwidth: 260, scale: 0.95, paddingtop: 1, paddingbottom: 28 });
                    scoreDiv.appendChild(wrapper);
                    contentDiv.appendChild(scoreDiv);
                } catch(e) {}
            }
            
            card.appendChild(titleDiv);
            card.appendChild(contentDiv);
            grade.appendChild(cartão);
        }
        
        página.appendChild(grade);
        container.appendChild(página);
    }
    brinde("📄 Layout gerado!", "sucesso");
}

função imprimirLayoutPiano() {
    janela.print();
}

function ajustarZoomPiano(v) {
    document.getElementById("zoomPianoVal").innerText = v;
    atualizarEditorPiano();
}

função ImagemPianom() {
    if (diagramasPiano.length === 0) { brinde("Adicione diagramas primeiro!", "warning"); retornar; }
    gerarLayoutPiano();
    setTimeout(() => {
        elemento const = document.getElementById("pianoContainer");
        html2canvas(elemento, { escala: 2, cor de fundo: "#ffffff", registro: falso }).then(canvas => {
            let link = document.createElement('a');
            link.download = `piano_diagramas_${Date.now()}.png`;
            link.href = canvas.toDataURL();
            link.click();
            brinde("🖼️ Imagem exportada!", "sucesso");
        }).catch(err => { console.error(err); brinde("Erro ao gerar imagem", "warning"); });
    }, 800);
}

funçãoCódigoPianoHTML() {
    if (diagramasPiano.length === 0) { brinde("Adicione diagramas primeiro!", "warning"); retornar; }
    gerarLayoutPiano();
    setTimeout(() => {
        deixe conteudo = document.getElementById("pianoContainer").innerHTML;
        let styles = document.querySelector("style")?.innerHTML || "";
        let html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Diagramas de Piano</title>
        <script src="https://cdn.jsdelivr.net/npm/abcjs@6.2.3/dist/abcjs-basic-min.js"><\/script>
        <style>${styles} .diagram-card { break-inside: avoid; page-break-inside: avoid; }</style>
        </head><body><div class="a4-container">${conteudo div></body></html>`;
        let blob = new Blob([html], {type: "text/html"});
        let a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `piano_diagramas_${Date.now()}.html`;
        a.clique();
        brinde("📑 HTML exportado!", "sucesso");
    }, 500);
}

// ============================================
// INICIALIZAÇÃO
// ============================================
função initPiano() {
    criarTecladoPiano();
    carregarDiagramasPiano();
    
    setTimeout(() => {
        setClefModePiano('treble');
        alternarNotaPiano(60); alternarNotaPiano(64); alternarNotaPiano(67);
        setClefModePiano('baixo');
        alternarNotaPiano(48); alternarNotaPiano(52); alternarNotaPiano(55);
        setClefModePiano('treble');
        atualizarEditorPiano();
    }, 100);
}

função abrirModalPiano() {
    const modal = document.getElementById('modalPiano');
    se (modal) {
        modal.style.display = 'block';
        initPiano();
    }
}

função fecharModalPiano() {
    const modal = document.getElementById('modalPiano');
    se (modal) modal.style.display = 'nenhum';
}

// Adicionar estilo para animação do brinde
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        0% { opacidade: 1; transformação: translateX(0); }
        70% { opacidade: 1; transformação: translateX(0); }
        100% { opacidade: 0; transformação: translateX(20px); }
    }
`;
document.head.appendChild(estilo);
