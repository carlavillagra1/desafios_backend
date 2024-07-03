async function filtrarProductos(page = 1) {
    const categoria = document.getElementById('categoria-select').value;
    const limit = document.getElementById('limit-input').value || 5;
    const query = document.getElementById('query-input').value || '';
    const sort = document.getElementById('sort-select').value || '';

    // Construir la URL del navegador
    let newUrl = `/home?limit=${limit}&page=${page}&sort=${sort}&query=${query}`;
    if (categoria !== 'products') {
        newUrl += `&categoria=${categoria}`;
    }
    history.pushState(null, '', newUrl);

    try {
        // Construir la URL para la consulta al servidor
        let fetchUrl = `/api/product/filtrar`;
        if (categoria !== 'products') {
            fetchUrl += `/${categoria}`;
        }
        fetchUrl += `?limit=${limit}&page=${page}&sort=${sort}&query=${query}`;

        const response = await fetch(fetchUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();

        const productosContainer = document.getElementById('productos');
        const contenedorPrincipal = document.getElementById('contenedorPrincipal');
        productosContainer.innerHTML = '';  // Limpiar contenedor
        console.log('Datos recibidos del servidor:', result);

        if (result.docs.length === 0) {
            console.log('No hay productos para mostrar');
            productosContainer.innerHTML = '<h1>No hay productos para mostrar</h1>';
            contenedorPrincipal.classList.remove('hidden');  // Mostrar contenedor principal
            return;
        }
        // Ocultar contenedor principal si hay productos filtrados
        contenedorPrincipal.classList.add('hidden');

        // Generar HTML dinámicamente
        result.docs.forEach(producto => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('carts');

            const thumbnail = document.createElement('img');
            thumbnail.classList.add('infoFoto');
            thumbnail.src = producto.thumbnail[0];
            thumbnail.alt = producto.title;
            productDiv.appendChild(thumbnail);

            const title = document.createElement('strong');
            title.classList.add('info');
            title.textContent = producto.title;
            productDiv.appendChild(title);

            const price = document.createElement('strong');
            price.classList.add('info');
            price.textContent = `Precio: $${producto.price}`;
            productDiv.appendChild(price);

            const detailsLink = document.createElement('a');
            detailsLink.href = `/api/views/productDetail/${producto._id}`;
            detailsLink.classList.add('btnDetail');
            detailsLink.textContent = 'Ver detalles';
            productDiv.appendChild(detailsLink);

            productosContainer.appendChild(productDiv);
        });

        // Paginación
        const paginateDiv = document.createElement('div');
        paginateDiv.classList.add('paginate');

        if (result.hasPrevPage) {
            const prevLink = document.createElement('a');
            prevLink.href = `#`;
            prevLink.textContent = '<< Anterior';
            prevLink.onclick = (e) => {
                e.preventDefault();
                filtrarProductos(result.prevPage);
            };
            paginateDiv.appendChild(prevLink);
        }

        const pageSpan = document.createElement('span');
        pageSpan.textContent = `Página ${result.page} de ${result.totalPages}`;
        paginateDiv.appendChild(pageSpan);

        if (result.hasNextPage) {
            const nextLink = document.createElement('a');
            nextLink.href = `#`;
            nextLink.textContent = 'Siguiente >>';
            nextLink.onclick = (e) => {
                e.preventDefault();
                filtrarProductos(result.nextPage);
            };
            paginateDiv.appendChild(nextLink);
        }
        productosContainer.appendChild(paginateDiv);
        
    }    
    catch (error) {
        document.getElementById('productos').innerHTML = "<h1>Error al filtrar productos</h1>";
    }
}
