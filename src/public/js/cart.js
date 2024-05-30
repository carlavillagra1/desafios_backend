document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.eliminar-producto').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const cartId = '6650dacf751e5e5f87b268c7' // Obtener el ID del carrito
            console.log('Product ID:', productId);
            console.log('Cart ID:', cartId);
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
            location.reload(); // Recarga la página para actualizar el carrito
        } else {
            alert('No se pudo eliminar el producto del carrito');
        }
    })
    .catch(error => console.error('Error:', error));
}