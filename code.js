fetch('data.json', { mode: 'no-cors' })
  .then(function (res) {
    return res.json()
  })
  .then(function (data) {
    var cy = window.cy = cytoscape({
      container: document.getElementById('cy'),

      boxSelectionEnabled: false,
      autounselectify: true,
      nodeSeparation: 30,

      layout: {
        name: 'concentric',
        concentric: function( node ){
          return node.degree();
        },
        levelWidth: function( nodes ){ // the letiation of concentric values in each level
          return nodes.maxDegree() * .18;
        },
        nodeDimensionsIncludeLabels: true
      },

      style: [
        {
          selector: 'node',
          style: {
            'label': 'data(name)',
            'height': 20,
            'width': 20,
            'background-color': 'data(color)'
          }
        },

        {
          selector: 'edge',
          style: {
            'curve-style': 'haystack',
            'haystack-radius': 0,
            'label': 'data(name)',
            'width': 4,
            'opacity': 0.5,
            'line-color': '#a8eae5'
          }
        }
      ],

      elements: data
    });

    function makePopper(ele) {
      let ref = ele.popperRef(); // used only for positioning

      ele.tippy = tippy(ref, {
        // tippy options:
        content: () => {
          let content = document.createElement("div");
          content.className = 'tooltip';
          content.innerHTML = ele.attr('precursorText');

          return content;
        },
        trigger: "manual" // probably want manual mode
      });
    }

    cy.ready(function () {
      cy.elements("edge").forEach(function (ele) {
        makePopper(ele);
      });
    });

    cy.elements().unbind("mouseover");
    cy.elements().bind("mouseover", event => event.target.tippy.show());

    cy.elements().unbind("mouseout");
    cy.elements().bind("mouseout", event => event.target.tippy.hide());

    // cy.panzoom({
    //   // options here...
    // });
  });
