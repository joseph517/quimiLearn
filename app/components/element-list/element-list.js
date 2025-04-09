export default function loadElementList() {

    fetch('elements_all.json')
        .then(response => response.json())
        .then(data => {
            // console.log(data.Table.Row);
            const listContainer = document.getElementById('list-container');

            data.Table.Row.forEach(element => {
                // console.log(element.Cell[2]);
                const elementContainer = document.createElement('div');
                elementContainer.classList.add('element-container');
                elementContainer.innerHTML = `
                    <div style="background-color: #${element.Cell[4]}" class="main-properties">
                        <span class="atomic-number">${element.Cell[0]}</span>
                        <h2 class="element-name-symbol">${element.Cell[1]}</h2>
                        <div class="element-name">${element.Cell[2]}</div>
                    </div>
                    <div class="detailed-properties">
                        <table class="property-table">
                            <tr>
                                <th class="table-label">Atomic Mass</th>
                                <td class="table-value">
                                    <span class="atomic-mass">${element.Cell[3]}</span> u
                                </td>
                            </tr>
                            <tr>
                                <th class="table-label">Standard State</th>
                                <td class="table-value">${element.Cell[11]}</td>
                            </tr>
                            <tr>
                                <th class="table-label">Electron Configuration</th>
                                <td class="table-value">${element.Cell[5]}</td>
                            </tr>
                            <tr>
                                <th class="table-label">Oxidation States</th>
                                <td class="table-value">${element.Cell[10]}</td>
                            </tr>
                            <tr>
                                <th class="table-label">Electronegativity (Pauling Scale)</th>
                                <td class="table-value">${element.Cell[6]}</td>
                            </tr>
                            <tr>
                                <th class="table-label">Atomic Radius (van der Waals)</th>
                                <td class="table-value">${element.Cell[7]} pm</td>
                            </tr>
                            <tr>
                                <th class="table-label">Ionization Energy</th>
                                <td class="table-value">${element.Cell[8]} eV</td>
                            </tr>
                            <tr>
                                <th class="table-label">Melting Point</th>
                                <td class="table-value">${element.Cell[12]} K</td>
                            </tr>
                            <tr>
                                <th class="table-label">Boiling Point</th>
                                <td class="table-value">${element.Cell[13]} K</td>
                            </tr>
                            <tr>
                                <th class="table-label">Density</th>
                                <td class="table-value">${element.Cell[14]} g/cm<sup>3</sup></td>
                            </tr>
                            <tr>
                                <th class="table-label">Year Discovered</th>
                                <td class="table-value">${element.Cell[16]}</td>
                            </tr>
                
                        </table>
                    </div>
                    
                `;
                listContainer.appendChild(elementContainer);

                document.getElementById('filter-input').addEventListener('keyup', (event) => {
                    const filterValue = event.target.value.toLowerCase();
                    const elements = document.querySelectorAll('.element-container');
                    elements.forEach(element => {
                        const elementName = element.querySelector('.element-name').textContent.toLowerCase();
                        const elementSymbol = element.querySelector('.element-name-symbol').textContent.toLowerCase();
                        if (elementName.startsWith(filterValue) || elementSymbol.startsWith(filterValue)) {
                            element.style.display = '';
                            element.style.animation = 'animation-element-list 0.5s ease-in-out';
                        } else {
                            element.style.display = 'none';
                        }
                    });
                });

            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// loadElementList();