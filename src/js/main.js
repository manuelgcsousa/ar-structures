/*
 * createGraph().
 */
function createGraph() {
	var nodes_list = JSON.parse(localStorage.getItem('nodes'));
	var links_list = JSON.parse(localStorage.getItem('links'));
	
	/* Criação de uma lista onde ligações de 'marriage' aparecem primeiro. */
	var links_list_ordered_by_marriage = [];
	links_list.forEach(link => {
		if (link.relation === 'marriage')
			links_list_ordered_by_marriage.unshift(link);
		else
			links_list_ordered_by_marriage.push(link);
	});
	
	// Cópia de todos os links para ser usada em 'gData'.
	var nodes = nodes_list.map(node => ({ id: node }));
	var links = [];
	
	links_list_ordered_by_marriage.forEach(link => {
		if (link.relation === 'marriage') {
			const ghost_node = { 'id': ('__Ghost_' + link.source + '_' + link.target + '__') };
			nodes.push(ghost_node);

			// Adicionar o nodo 'ghost' aos respetivos Source e Target.
			nodes.map(node => {
				if (node.id === link.source || node.id === link.target)
					node['ghost'] = ghost_node.id;
			});

			const source2ghost = { 'source': link.source, 'target': ghost_node.id };
			const target2ghost = { 'source': link.target, 'target': ghost_node.id };
			links.push(source2ghost);
			links.push(target2ghost);
			links.push(link);
		}

		if (link.relation === 'ascending') {
			const ghost = nodes.filter(node => {
				if (node.id === link.source)
					if (node['ghost'])
						return node;
			})[0];
			
			if (ghost === undefined) {
				links.push(link);
			} else {
				const new_link = { "source": ghost.ghost, "target": link.target };
				links.push(new_link);
			}
		}

		if (link.relation === 'descending') { links.push(link); }
	});

	const gData = {
		nodes: nodes,
		links: links 
	}
	
	return gData;
}


/*
 * drawGraph().
 */
function drawGraph(gData) {
	const Graph = 
		ForceGraphAR()(document.getElementById('3d-graph'))
			.linkDirectionalParticleColor(() => 'green')
			.linkDirectionalParticleWidth(10)
			.nodeAutoColorBy('group')
			// .nodeColor('green')
			.linkWidth(0.5)
			.linkOpacity(0.9)
			.nodeThreeObject(node => {
				if (node.id.startsWith('__Ghost')) {
					 var solid = new THREE.Mesh([
						 new THREE.SphereGeometry(5, 5, 5)
					 ][0],
						new THREE.MeshLambertMaterial({
							color: 'red', 
							transparent: true,
							opacity: 0.9
						})
					 );

					return solid;
				} else {
					const sprite = new SpriteText(node.id);
					sprite.color = node.color;
					sprite.textHeight = 10;
					return sprite;
				}
			})
			.linkThreeObject(link => {
				if (link.relation === 'marriage')
					link.color = '#009419';
			})
			.linkPositionUpdate((sprite, { start, end }) => {
				const middlePos = Object.assign(...['x', 'y', 'z'].map(c => ({
					[c]: start[c] + (end[c] - start[c]) / 2 // calc middle point
				})));
				
				// position sprite.
				Object.assign(sprite.position, middlePos);
			})
			.glScale(50) // Quanto maior a escala, menor o graph.
			.graphData(gData);

	return Graph;
}



/*
document.getElementById('emit-particles-btn')
	.addEventListener('click', () => {
		[...Array(N).keys()].forEach(() => {
			const link = gData.links[Math.floor(Math.random() * gData.links.length)];
			Graph.emitParticle(link);
        });
    });

document.getElementById('aumentar-btn')
	.addEventListener('click', () => {
		const { nodes, links } = Graph.graphData();
		var qtd = parseInt(prompt("Nó para add !! ",""));
		console.log(qtd);
		const id = nodes.length;
		Graph.graphData({
			nodes: [...nodes, { id }],
            // onde tenho que fazer controlo - add em nodo específico.
			links: [...links, { source: id, target: qtd-1 }]//Math.round(Math.random() * (id-1))
        });
    });
*/
