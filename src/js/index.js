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
		// ver quais os nodos que estão no localStorage
		// sacar os nodos que estão em nodes_list
		// comparar as duas listas
			// se as listas forem iguais, não é necessário alterar nada
			// caso contrário, verificar quais são os elementos que são novos, e adicionar a todos os selects.

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
	}
}
