class Graph
{
	static genGraph() {
		// onload execute 'allowTabbing' \\
			allowTabbing();
		// ----------------------------- \\

		var Graph;

		const toCreate = JSON.parse(localStorage.getItem('toCreate'));
		if (!toCreate) {
			const gData = JSON.parse(localStorage.getItem('graph'));
			Graph = drawGraph(gData);
		} else {
			// Criar estrutura de dados para guardar informação dos nodos.
			var information = {};
			
			var nodes = JSON.parse(localStorage.getItem('nodes'));
			nodes.forEach(node => { information[node] = {}; })
			localStorage.setItem('information', JSON.stringify(information));
	
			/* Geração do Grafo. */
			var gData = createGraph();
			localStorage.setItem('graph', JSON.stringify(gData));
			
			Graph = drawGraph(gData);
		}

		
		// onload execute 'downloadTree' \\
			downloadTree();
		// ----------------------------- \\

		return Graph;
	}
	
	static getNodes() {
		const nodes_list = document.getElementById("nodes_list");

		// Clean previous DOM's elements inside 'nodes_list'.
		nodes_list.innerHTML = "";

		/* Create a new list of nodes. */
		const gData = JSON.parse(localStorage.getItem('graph'));
		console.log(gData);
		gData['nodes'].forEach(elem => {
			if ( !(elem.id.startsWith('__Ghost')) )
				nodes_list.innerHTML += ( 
					'<li>' + 
					'<button type="button" class="btn btn-primary" data-toggle="modal" data-dismiss="modal" data-target="#node_information_modal" onclick="Graph.getNodeInformation(\'' + elem.id + '\')">' + 
					elem.id + 
					'</button>' +
					'</li></br>'
				);
		});
	}

	static getNodeInformation(id_node) {
		var information = JSON.parse(localStorage.getItem('information'));
		var node_info = JSON.stringify(information[id_node], null, '\t');

		document.getElementById('node_data').value = node_info;
		
		// Colocar o nodo no localStorage como temporário.
		localStorage.setItem('temp_node', id_node);
	}

	static saveNodeData() {
		try {
			var information = JSON.parse(localStorage.getItem('information'));
			const textarea_data = document.getElementById('node_data').value;
		
			information[localStorage.getItem('temp_node')] = JSON.parse(textarea_data);
			localStorage.setItem('information', JSON.stringify(information, null, '\t'));

			/* Fazer update à informação para download. */
			downloadTree();
			
			alert('Node information saved with success!');
		} catch (e) {
			if (e instanceof SyntaxError) {
				alert('The syntax if not correct: ' + e);
			}
		}
	}
}
