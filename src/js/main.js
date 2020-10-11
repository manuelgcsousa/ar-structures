/*
 * createGraph().
 */
function createGraph() {
	const N = parseInt((document.getElementById('graph-size').value));
	const gData = {
		nodes: [...Array(N).keys()].map(i => ({ id: i })),
		links: [...Array(N).keys()]
			.filter(id => id)
			.map(id => ({
				source: id,
				// fazer controlo de ligações.
				target: Math.round(Math.random() * (id - 1))
			}))
	};

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
			.linkWidth(1)
			.linkOpacity(0.9)
			.nodeThreeObject(({ id }) => new THREE.Mesh(
				[
					new THREE.BoxGeometry(15,15,15),
				][id%1],
				new THREE.MeshLambertMaterial({
					// controlo da cor do objeto 3D.
					color: 100, // Math.round(Math.random() * Math.pow(2, 24)),
					transparent: false,
					opacity: 1
				})
			))
			.linkPositionUpdate((sprite, { start, end }) => {
				const middlePos = Object.assign(...['x', 'y', 'z'].map(c => ({
					[c]: start[c] + (end[c] - start[c]) / 2 // calc middle point
				})));
				
				// position sprite.
				Object.assign(sprite.position, middlePos);
			})
			.graphData(gData);
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
