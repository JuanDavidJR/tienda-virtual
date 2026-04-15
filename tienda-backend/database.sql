-- Tablas
CREATE TABLE categoria (
    id_categoria INT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE proveedor (
    id_proveedor INT PRIMARY KEY,
    nombre VARCHAR(100),
    telefono VARCHAR(20)
);

CREATE TABLE producto (
    id_producto INT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL,
    id_categoria INT,
    id_proveedor INT
);

CREATE TABLE cliente (
    id_cliente INT PRIMARY KEY,
    nombre VARCHAR(100),
    telefono VARCHAR(20)
);

CREATE TABLE empleado (
    id_empleado INT PRIMARY KEY,
    nombre VARCHAR(100),
    cargo VARCHAR(50)
);

CREATE TABLE venta (
    id_venta INT PRIMARY KEY,
    fecha TIMESTAMP,
    id_cliente INT,
    id_empleado INT
);

CREATE TABLE detalle_venta (
    id_detalle INT PRIMARY KEY,
    id_venta INT,
    id_producto INT,
    cantidad INT,
    precio_unitario DECIMAL(10,2)
);

-- Relaciones
ALTER TABLE producto
ADD FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria);

ALTER TABLE producto
ADD FOREIGN KEY (id_proveedor) REFERENCES proveedor(id_proveedor);

ALTER TABLE venta
ADD FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente);

ALTER TABLE venta
ADD FOREIGN KEY (id_empleado) REFERENCES empleado(id_empleado);

ALTER TABLE detalle_venta
ADD FOREIGN KEY (id_venta) REFERENCES venta(id_venta);

ALTER TABLE detalle_venta
ADD FOREIGN KEY (id_producto) REFERENCES producto(id_producto);





INSERT INTO categoria VALUES (1, 'Electrónica');

INSERT INTO proveedor VALUES (20, 'Tech Solutions', '6014445566');

INSERT INTO producto VALUES (10, 'Teclado Mecánico', 150000, 20, 1, 20);

INSERT INTO cliente VALUES (50, 'Juan Pérez', '3001234567');

INSERT INTO empleado VALUES (5, 'Ana García', 'Vendedor');

INSERT INTO venta VALUES (1, NOW(), 50, 5);

INSERT INTO detalle_venta VALUES (1, 1, 10, 2, 150000);


-- READ (Consultas importantes)

-- Ver productos con categoría
SELECT p.nombre, c.nombre AS categoria
FROM producto p
JOIN categoria c ON p.id_categoria = c.id_categoria;

-- Ver ventas completas
SELECT v.id_venta, c.nombre AS cliente, e.nombre AS empleado
FROM venta v
JOIN cliente c ON v.id_cliente = c.id_cliente
JOIN empleado e ON v.id_empleado = e.id_empleado;

-- Ver detalle de una venta
SELECT p.nombre, d.cantidad, d.precio_unitario
FROM detalle_venta d
JOIN producto p ON d.id_producto = p.id_producto
WHERE d.id_venta = 1;

-- UPDATE (Actualizar)
UPDATE producto SET precio = 160000 WHERE id_producto = 10;
UPDATE producto SET stock = stock - 2 WHERE id_producto = 10;

-- DELETE (Eliminar)
DELETE FROM detalle_venta WHERE id_detalle = 1;
DELETE FROM venta WHERE id_venta = 1;


