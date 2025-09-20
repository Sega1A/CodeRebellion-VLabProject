# Convenciones de codigo

1. Matrices
2. Métodos asíncronos
3. Comentarios
4. Funciones
5. Bucles y sentencias condicionales
6. Objetos
7. Variables
8. Idioma de codificacion

## Matrices

Definicion de matrices vacias

```js
let array = [];
```

Definicion de matrices con valores iniciales

```js
let arrayWithContent = [1, 2, 2, 3];
```

Definicion de matrices multidimencionales cuadraticas o no cuadraticas.

```js
let array2Dimention = [
  [1, 2],
  [3, 4],
];
```

## Metodos asincronos

Funciones asincronas

```js
const fetchData = async (props) => {
  const response = await fetch(url);
};
```

## Comentarios

Comentarios de linea para explicaciones cortas

```js
const fillingArray = (elements) => {
  // Funcion que llena una lista de elementos
  // Codigo
};
```

Comentarios de bloque para documentacion de codigo o explicaciones extensas.

```js
/*
 *    Comentarios en bloque
 */
const fillingArray = (elements) => {
  // Codigo
};
```

## Funciones

Definicion de una funcion

```js
// arrow function
const fibonacci = () => {
  // codigo
};
```

## Bucles y sentencias condicionales

Para While

```js
while (i < 10) {
  // repetir 10 veces
  sum += i;
}
```

Para For

```js
for (let i = 0; i < 10; i++) {
  // Codigo
}
```

Para ForEach

```js
array.forEach((each) => /* Codigo */);
```

### Sentencias condicionales

Para `if`, usaremos el `else` cuando queramos hacer algo cuando nuestra variable sea `false`

```js
let flag = false;
if (flag) {
  // Codigo
} else {
  // Codigo
}
```

Para `Switch`
Definiremos los casos y un default en todos los casos.

```js
const value = 1;
switch (value) {
  case 1:
    // Codigo
    break;
  case 2:
    // Codigo
    break;
  case 3:
    // Codigo
    break;
  case 4:
    // Codigo
    break;
  default:
  // Codigo
}
```

## Objetos

Para crear un nuevo objeto

```js
const obj = new Object();
```

Para crear un objeto con datos iniciales

```js
class Car {
  id: number;
  nombre: string;

  constructor() {
    this.id = id;
    this.nombre = nombre;
  }
}
const carrito = new Car(1, "toyota");
```

## Variables

Definicion de variables

```js
let contador = 0;
let nombreGrande = 99999999;
const PI = 3.14;
```

Se usará `let` cuando usemos variables que pueden llegar a cambiar a lo largo del tiempo

```js
let numero = 3;
numero = 10;
numero = 40;
```

Se usará `const` cuando usemos variables constantes que no cambiarán, estas serán escritas en mayusculas para diferenciarlas con los otros tipos de variables.

```js
const PI = 3.14;
```

## Idioma de codificacion

El idioma de codificacion será en `Ingles`.
