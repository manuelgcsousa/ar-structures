class Index
{
	static addNodeInput() {
		var nodes_list = document.getElementById('nodes_list');
		nodes_list.insertAdjacentHTML('beforeend',
			'<p>' +
			'<li>' +
			'<input type="text"></input>' +
			'<span class="close_custom">&times;</span>' +
			'</li>' +
			'</p>'
		);
		
		// Adicionar eventos de click aos novos list item.
		closeButtons();
	}
	
	
	static populateLinksDropdown() {
		var nodes = [];
		
		/* Obter todos os nodos previamente criados. */
		var inputNodes = document.getElementById('nodes_list').querySelectorAll('input');
		inputNodes.forEach((item, index) => {
			nodes.push(item.value);
		});
		
		// Guardar lista de nodos em localStorage.
		localStorage.setItem('nodes', JSON.stringify(nodes));

		var links_list = document.getElementById('links_list');
		const linksItemsTotal = links_list.querySelectorAll('li').length;
		links_list.innerHTML = ''; // limpar todos os dropdowns.
		
		/* Adicionar todos os links (dropdowns) com os novos nodos. */
		for (var i = 0; i < linksItemsTotal; i++)
			Index.addLink();
		
		
		/*
		// ver quais os nodos que estão no localStorage
		// sacar os nodos que estão em nodes_list
		// comparar as duas listas
			// se as listas forem iguais, não é necessário alterar nada
			// caso contrário, verificar quais são os elementos que são novos, e adicionar a todos os selects.

		var nodes = [];
		
		var inputNodes = document.getElementById('nodes_list').querySelectorAll('input');
		inputNodes.forEach((item, index) => nodes.push(item.value));

		var oldNodes = JSON.parse(localStorage.getItem('nodes'));
		if (oldNodes != null) {
			// Obter a diferença entre os dois arrays.
			var diff = arr_diff(oldNodes, inputNodes);
			
			for (var i = 0; i < diff.length; i++) {
				var selects = document.getElementById('links_list').getElementsByTagName('select');
				
				for (var j = 0; j < selects.length; j++) {
					if (oldNodes.length > newNodes) {
						for (var k = 0; k < selects[j].childNodes.length; k++) {
							if (selects[j][k].innerHTML === diff[i]) {
								selects[j].removeChild(selects[j][k]);
							}
						} 
					} else {
						var opt = document.createElement('option');
						opt.value = diff[i];
						opt.innerHTML = diff[i];
						selects[j].appendChild(opt);
					}
				}
			}
			
			if (newNodes.length > 0) {
				var selects = document.getElementById('links_list').getElementsByTagName('select');
				for (var i = 0; i < selects.length; i++) {
					newNodes.forEach(newNode => {
						var opt = document.createElement("option");
						opt.value = newNode.toLowerCase();
						opt.innerHTML = newNode;
						selects[i].appendChild(opt);
					});
				}
			}
		}
		*/
	}

	static addLink() {
		/* Criação dos dois dropdown para Source e Target. */
		var select_source = document.createElement('select');
		var select_target = document.createElement('select');

		const nodes = JSON.parse(localStorage.getItem('nodes'));
		nodes.forEach(node => {
			var source = document.createElement('option');
			source.value = node;
			source.innerHTML = node;

			var target = document.createElement('option');
			target.value = node;
			target.innerHTML = node;
			
			select_source.appendChild(source);
			select_target.appendChild(target);
		});
		
		/* Criação do dropdown para o tipo de Relação entre Source e Target. */
		var select_relation = document.createElement('select');
		
		var asc = document.createElement('option');
		asc.value = 'ascending';
		asc.innerHTML = 'Ascending';
		
		var des = document.createElement('option');
		des.value = 'descending';
		des.innerHTML = 'Descending';
	
		var mar = document.createElement('option');
		mar.value = 'marriage';
		mar.innerHTML = 'Marriage';

		select_relation.appendChild(asc);
		select_relation.appendChild(des);
		select_relation.appendChild(mar);
		
		/* Adicionar os 3 dropdowns a um list item e por sua vez, a uma unordered list. */
		var p = document.createElement('p');
		var li = document.createElement('li');
		li.appendChild(select_source); li.insertAdjacentHTML("beforeend", '&nbsp; &#8594; &nbsp;');
		li.appendChild(select_relation); li.insertAdjacentHTML("beforeend", '&nbsp; &#8594; &nbsp;');
		li.appendChild(select_target); li.insertAdjacentHTML('beforeend', '<span class="close_custom">&times;</span>');
		p.appendChild(li);
		
		const links_list = document.getElementById('links_list');
		links_list.appendChild(p);
		
		// Adicionar eventos de click aos novos list item.
		closeButtons();
	}
	
	static buildGraph() {
		var links = [];
		
		var li = document.getElementById('links_list').querySelectorAll('li');
		li.forEach((item, index) => {
			var link = {};

			var select = item.querySelectorAll('select');
			for (var i = 0; i < select.length; i++) {
				if (i == 0)
					link['source'] = select[i].value;
				
				if (i == 1)
					link['relation'] = select[i].value;	

				if (i == 2)
					link['target'] = select[i].value;
			}
			
			links.push(link);
		});
			
		localStorage.setItem('links', JSON.stringify(links));

		// Colocar flag no localStorage para indicar que grafo tem que ser desenhado.
		localStorage.setItem('toCreate', JSON.stringify(true));
	}

	static readUploadedFile() {
		const fileSelector = document.getElementById('file-selector');
		fileSelector.addEventListener('change', (event) => {
			const fileList = event.target.files[0];
			
			const reader = new FileReader();
			reader.addEventListener('load', (event) => {
				try {
					var tree = JSON.parse(event.target.result);
					
					var graph = tree['graph'];
					var data = tree['data'];

					// Colocar flag no localStorage para indicar que grafo já está construído.
					localStorage.setItem('toCreate', JSON.stringify(false));
					
					// Colocar toda a árvore no localStorage.
					localStorage.setItem('graph', JSON.stringify(graph));
					localStorage.setItem('information', JSON.stringify(data));
					
					location.href = "/graph.html";
				} catch (e) {
					alert('File is not valid.');
				}
			});

			reader.readAsText(fileList);
		});
	}
}




/* UTILS */
function arr_diff(a1, a2) {
	var a = [], diff = [];

	for (var i = 0; i < a1.length; i++) a[a1[i]] = true;

	for (var i = 0; i < a2.length; i++) {
		if (a[a2[i]]) delete a[a2[i]];
		else a[a2[i]] = true;
	}
	
	for (var k in a) diff.push(k);

	return diff;
}
