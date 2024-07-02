document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.btnEliminar').forEach(button => {
        button.addEventListener('click', function() {
            const productId = button.getAttribute('data-product-id');
            const cartId = this.getAttribute('data-cart-id') // Obtener el ID del carrito
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