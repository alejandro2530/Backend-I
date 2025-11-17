const socket = io(); // esto establece la conección del cliente con el servidor de sockets

socket.on("productos_actualizados", (products) => {
    const box = document.getElementById("box_list");
    box.innerHTML = "";
    products.products.forEach(p => {
        box.innerHTML += `
        <div>
            <p>${p.title}</p>
        </div>
        <hr>`;
    });
});