<div align="center">

# 🪐 NEXO Platform
**Plataforma Interactiva de Aprendizaje para Ciencias de la Computación e Ingeniería**

[![Astro](https://img.shields.io/badge/Astro-7.3-BC52EE?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build/)
[![React](https://img.shields.io/badge/React-19.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)](LICENSE)

*Una experiencia educativa moderna, inmersiva y de alto rendimiento diseñada con arquitectura web estática, microinteracciones fluidas y estética de paneles de vidrio (glassmorphism).*

---

</div>

## 📌 Tabla de Contenidos
- [Acerca de Nexo](#-acerca-de-nexo)
- [Módulos y Laboratorios](#-módulos-y-laboratorios)
  - [1. Arquitectura del Computador](#1-arquitectura-del-computador)
  - [2. Base de Datos y Big Data](#2-base-de-datos-y-big-data)
- [Características de Diseño (UI/UX)](#-características-de-diseño-uiux)
- [Stack Tecnológico](#-stack-tecnológico)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Primeros Pasos](#-primeros-pasos)
  - [Requisitos](#requisitos)
  - [Instalación](#instalación)
  - [Scripts Disponibles](#scripts-disponibles)
- [Despliegue](#-despliegue)
- [Créditos y Desarrolladores](#-créditos-y-desarrolladores)
- [Licencia](#-licencia)

---

## 💡 Acerca de Nexo

**Nexo Platform** es un ecosistema digital interactivo concebido para estudiantes y profesionales de Ingeniería de Sistemas y Computación. Combina la velocidad ultra rápida de generación estática de **Astro** con la reactividad en tiempo real de **React**, permitiendo practicar conceptos fundamentales mediante simuladores dinámicos, validación inmediata de algoritmos lógicos y entrenamiento técnico intensivo.

---

## 🧪 Módulos y Laboratorios

### 1. Arquitectura del Computador
Un entorno práctico para la resolución y simplificación de circuitos lógicos combinacionales:
- **Tabla de Verdad Interactiva:** Soporte dinámico para problemas de 2, 3 y 4 variables de entrada con evaluación booleana en tiempo real.
- **Mapa de Karnaugh (K-Map):** Matriz visual con código Gray (`00`, `01`, `11`, `10`) para minitérminos y validación cruzada.
- **Simplificación y Procedimiento:** Métodos de resolución por Álgebra de Boole y agrupación de adyacencias en Karnaugh.
- **Teclado Flotante de Funciones:** Teclado virtual adaptativo con operadores booleanos (`+`, `·`, `'`, `(`, `)`, `=`) para una experiencia ágil sin depender de atajos difíciles en teclado físico.
- **Sistema de Pistas Contextuales y Verificación:** Algoritmo propio de inferencia que valida la equivalencia formal de las expresiones ingresadas.

### 2. Base de Datos y Big Data
Herramienta de preparación de alta intensidad para evaluaciones técnicas y sustentaciones orales:
- **30 Flashcards Técnicas con Giro 3D:**
  - Conceptos de *Integridad y Tipos*, *T-SQL y Ventana*, *Triggers y Cursores*, y *Big Data y Arquitectura BI*.
  - Efecto de giro tridimensional (*3D Card Flip*) con atajos rápidos de teclado (`Espacio` para voltear, flechas para navegar, `M` para marcar dominada y `R` para tarjeta aleatoria).
  - Persistencia del progreso de dominio en `localStorage`.
- **Cuestionario Técnico (Quiz) de 32 Preguntas:**
  - Preguntas de opción múltiple con retroalimentación inmediata, justificación conceptual y bloques de código SQL reales.
  - Cuadrícula de salto directo a cualquier pregunta con código de colores.
  - Evaluación final con porcentaje de precisión y diagnóstico de fortalezas y áreas de repaso.
- **Dock Inferior Fijo:** Barra de navegación ergonómica en pantallas móviles que nunca se desplaza ni se solapa con el contenido al mostrarse las explicaciones.

---

## 🎨 Características de Diseño (UI/UX)

- **Dark Theme Puro:** Paleta basada en negros profundos (`#000000`, `#0A0A0C`) con resplandores degradados en púrpura y lila corporativo (`#a855f7`, `#9333ea`).
- **Glassmorphism Avanzado:** Tarjetas y paneles con desenfoque de fondo profundo (`backdrop-blur-2xl`), bordes milimétricos translúcidos y sombras volumétricas.
- **Totalmente Responsive:** Diseño concebido *Mobile-First*, optimizado para navegación táctil con el pulgar en teléfonos, tablets y ordenadores.
- **Header Inteligente (*Sticky*):** Cabecera fija durante el desplazamiento vertical, con tabs superiores de cambio de modo y contador dinámico por contexto.
- **Animación Continua de Desarrolladores:** Efecto typewriter cíclico cada 5 segundos que alterna dinámicamente entre alias y nombres completos de los autores.

---

## 🛠️ Stack Tecnológico

| Herramienta | Propósito |
| :--- | :--- |
| **Astro 7** | Framework web moderno para generación de sitios estáticos ultrarrápidos (SSG) |
| **React 19** | Biblioteca para interfaces de usuario y componentes de cliente interactivos |
| **Tailwind CSS 3** | Framework utilitario para diseño responsivo y sistemas de tokens visuales |
| **Lucide React** | Set de iconos vectoriales consistentes y modernos |
| **Framer Motion** | Animaciones físicas y transiciones interactivas |
| **TypeScript / JS** | Tipado estático y lógica algorítmica modular |

---

## 📁 Estructura del Proyecto

```text
nexo/
├── public/                     # Recursos públicos estáticos (favicons, svgs)
├── src/
│   ├── components/             # Componentes de UI y laboratorios interactivos
│   │   ├── BigDataLab.jsx      # Laboratorio completo de Flashcards y Quiz de Big Data
│   │   ├── NexoLab.jsx         # Laboratorio de Arquitectura del Computador
│   │   └── ui/                 # Componentes atómicos (Spotlight, botones, efectos)
│   ├── data/                   # Datos estructurados y diccionarios técnicos
│   │   ├── bigDataQuestions.js # Banco de 30 flashcards y 32 preguntas de BD
│   │   └── problems.js         # Banco de problemas lógicos de Arquitectura
│   ├── layouts/
│   │   └── MainLayout.astro    # Plantilla base HTML, fuentes, spotlight y SEO
│   ├── pages/                  # Enrutamiento estático de Astro
│   │   ├── index.astro         # Portada de selección de cursos
│   │   ├── arquitectura.astro  # Ruta del laboratorio de Arquitectura
│   │   └── bd.astro            # Ruta del laboratorio de Big Data
│   ├── styles/
│   │   └── global.css          # Variables CSS, clases glass y utilidades
│   └── utils/
│       └── engine.js           # Motor de evaluación y análisis booleano
├── package.json
└── astro.config.mjs
```

---

## 🚀 Primeros Pasos

### Requisitos
- **Node.js**: Versión `>= 22.12.0`
- **npm** (o gestor compatible como `pnpm` o `yarn`)

### Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/jeffryjara/nexo.git
cd nexo
```

2. Instala las dependencias:
```bash
npm install
```

### Scripts Disponibles

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor de desarrollo local en `http://localhost:4321` |
| `npm run build` | Compila la aplicación optimizada para producción en `./dist/` |
| `npm run preview` | Previsualiza localmente la compilación de producción |

---

## ☁️ Despliegue

La plataforma está optimizada para desplegarse sin configuración adicional en **Vercel**:

1. Conecta tu repositorio de GitHub a Vercel.
2. Vercel detectará automáticamente **Astro** como framework preset.
3. El comando de build se configurará como `npm run build` y el directorio de salida como `dist/`.
4. Cada push a la rama `main` disparará automáticamente un nuevo despliegue en producción.

---

## 👥 Créditos y Desarrolladores

Desarrollado con dedicación por:

- **Jeffry Jara (J3T)** — [@jeffryjara](https://github.com/jeffryjara)
- **Juan Huertas (JuanHP)**

---

## 📄 Licencia

Este proyecto está bajo la Licencia [MIT](LICENSE). Siéntete libre de utilizarlo, aprender y contribuir.
