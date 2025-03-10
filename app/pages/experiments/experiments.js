export default function experiments() {
    let id;
    let experiments = JSON.parse(localStorage.getItem('experiments')) || []; // Usar localStorage

    const experimentsList = document.getElementById('list-container-experiments');
    const form = document.getElementById('form-experiment');

    function renderExperiments() {
        experimentsList.innerHTML = '';

        experiments.forEach((experiment, index) => {
            const experimentContainer = document.createElement('div');
            experimentContainer.innerHTML = `
                <div class="experiment-card experiment-background mb-16 pd-24">
                    <div class="experiment-header">
                        <h3 class="experiment-name">${experiment.name}</h3>
                        <div class="experiment-name-container">
                            <button class="edit-button experiment-button" data-index="${index}">
                                <img class="hg-16 wd-16" src="app/assets/experiments/boton-editar.png" alt="Editar">
                            </button>
                            <button class="delete-button experiment-button" data-index="${index}">
                                <img class="hg-16 wd-16" src="app/assets/experiments/eliminar.png" alt="Eliminar">
                            </button>
                        </div>
                    </div>
                    <div class="experiment-content">
                        <p class="experiment-description mb-8">${experiment.description}</p>
                        <div class="experiment-compounds-container">
                            <h3 class="experiment-compounds-title mb-4">Compuestos Químicos</h3>
                            <div class="compounds-list">${formatCompounds(experiment.elements)}</div>
                        </div>
                        <div class="experiment-process-container">
                            <h3 class="experiment-process-title mb-4">Procedimiento</h3>
                            <p class="experiment-text mb-8">${experiment.process}</p>
                        </div>
                        <div class="experiment-result-container">
                            <h3 class="experiment-result-title mb-4">Observaciones</h3>
                            <p class="experiment-text mb-8">${experiment.result}</p>
                        </div>
                    </div>
                </div>
            `;
            experimentsList.appendChild(experimentContainer);
        });

        // Asignar eventos después de renderizar
        assignEvents();
    }

    function formatCompounds(elements) {
        return elements.map(element => 
            `<span class="compound-badge">${element}</span>`
        ).join('');
    }

    function assignEvents() {
        // Editar
        document.querySelectorAll('.edit-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.currentTarget.dataset.index;
                editExperiment(index);
            });
        });

        // Eliminar
        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.currentTarget.dataset.index;
                deleteExperiment(index);
            });
        });
    }

    // Manejo del formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const isEmpty = [...formData.entries()].some(([key, value]) => !value.trim());
        if (isEmpty) return;
     
        console.log('Formulario enviado');

        const experimentData = {
            name: form.name.value.trim(),
            description: form.description.value.trim(),
            result: form.result.value.trim(),
            process: form.process.value.trim(),
            elements: form.compounds.value.split(',').map(item => item.trim())
        };

        if (id !== undefined) {
            experiments[id] = experimentData;
        } else {
            experiments.push(experimentData);
        }

        localStorage.setItem('experiments', JSON.stringify(experiments));
        id = undefined;
        form.reset();
        renderExperiments();
    });

    function editExperiment(index) {
        const experiment = experiments[index];
        id = index;
        
        form.name.value = experiment.name;
        form.description.value = experiment.description;
        form.result.value = experiment.result;
        form.process.value = experiment.process;
        form.compounds.value = experiment.elements.join(', ');
    }

    function deleteExperiment(index) {
        experiments.splice(index, 1);
        localStorage.setItem('experiments', JSON.stringify(experiments));
        renderExperiments();
    }

    // Inicialización
    renderExperiments();
}