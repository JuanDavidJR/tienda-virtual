
CREATE DATABASE ventas;

-- (Conéctate manualmente a la BD antes de seguir)

-- Tablas
CREATE TABLE categoria (
    id_categoria INT,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE producto (
    id_producto INT,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL,
    id_categoria INT
);

CREATE TABLE proveedor (
    id_proveedor INT,
    nombre VARCHAR(100),
    telefono VARCHAR(20)
);

CREATE TABLE cliente (
    id_cliente INT,
    nombre VARCHAR(100),
    telefono VARCHAR(20)
);

CREATE TABLE empleado (
    id_empleado INT,
    nombre VARCHAR(100),
    cargo VARCHAR(50)
);

CREATE TABLE venta (
    id_venta INT,
    fecha TIMESTAMP,
    id_cliente INT,
    id_empleado INT
);

CREATE TABLE detalle_venta (
    id_detalle INT,
    id_venta INT,
    id_producto INT,
    cantidad INT,
    precio_unitario DECIMAL(10,2)
);

-- PRIMARY KEYS
ALTER TABLE categoria 
ADD PRIMARY KEY (id_categoria);

ALTER TABLE producto 
ADD PRIMARY KEY (id_producto);

ALTER TABLE proveedor 
ADD PRIMARY KEY (id_proveedor);

ALTER TABLE cliente 
ADD PRIMARY KEY (id_cliente);

ALTER TABLE empleado 
ADD PRIMARY KEY (id_empleado);

ALTER TABLE venta 
ADD PRIMARY KEY (id_venta);

ALTER TABLE detalle_venta 
ADD PRIMARY KEY (id_detalle);

-- FOREIGN KEYS
ALTER TABLE producto
ADD FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria);

ALTER TABLE venta
ADD FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente);

ALTER TABLE venta
ADD FOREIGN KEY (id_empleado) REFERENCES empleado(id_empleado);

ALTER TABLE detalle_venta
ADD FOREIGN KEY (id_venta) REFERENCES venta(id_venta);

ALTER TABLE detalle_venta
ADD FOREIGN KEY (id_producto) REFERENCES producto(id_producto);



INSERT INTO categoria VALUES (1, 'Electrónica');

INSERT INTO producto VALUES (10, 'Teclado Mecánico', 150000, 20, 1);

INSERT INTO cliente VALUES (50, 'Juan Pérez', '3001234567');

INSERT INTO empleado VALUES (5, 'Ana García', 'Vendedor');

INSERT INTO proveedor VALUES (20, 'Tech Solutions', '6014445566');




SELECT * FROM producto;
SELECT * FROM venta WHERE id_cliente = 50;
SELECT nombre, stock FROM producto WHERE stock < 10;
SELECT * FROM empleado WHERE cargo = 'Vendedor';
SELECT * FROM detalle_venta WHERE id_venta = 1;


