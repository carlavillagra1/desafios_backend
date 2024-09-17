document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.btnEliminar').forEach(button => {
        button.addEventListener('click', function () {
            const productId = button.getAttribute('data-product-id');
            const cartId = this.getAttribute('data-cart-id'); 
            eliminarProductoDelCarrito(cartId, productId);
        });
    });
});

function eliminarProductoDelCarrito(cartId, productId) {
    fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(data => {
            if (data.result === "success") {
                location.reload(); 
            } else {
                alert('No se pudo eliminar el producto del carrito');
            }
        })
        .catch(error => console.error('Error:', error));
}

document.getElementById('finalize-purchase').addEventListener('click', async function () {
    try {
        const cartId = this.getAttribute('data-cart-id');
        console.log('Cart ID for purchase:', cartId);

        // Finalizar la compra y obtener el ticket
        const response = await fetch(`/api/carts/${cartId}/purchase`, {
            method: 'POST',
        });

        if (response.ok) {
            const result = await response.json();
            
            // Verificar si result.payload existe y tiene la propiedad _id
            if (result.payload && result.payload._id) {
                alert('Compra finalizada con éxito. Ticket ID: ' + result.payload._id);

                // Vaciar el carrito
                const clearResponse = await fetch(`/api/carts/${cartId}/clear`, {
                    method: 'DELETE',
                });

                if (clearResponse.ok) {
                    alert('El carrito se ha vaciado con éxito');
                    // Redirigir al usuario a la página del ticket
                    window.location.href = `/api/views/tickets/${result.payload._id}`;
                } else {
                    const error = await clearResponse.json();
                    alert('Error al vaciar el carrito: ' + error.message);
                }
            } else {
                alert('Error: No se recibió el ID del ticket en la respuesta');
            }
        } else {
            const error = await response.json();
            alert('Error al finalizar la compra: ' + error.message);
        }
    } catch (error) {
        console.error('Error al finalizar la compra:', error);
        alert('Error al finalizar la compra: ' + error.message);
    }
});
