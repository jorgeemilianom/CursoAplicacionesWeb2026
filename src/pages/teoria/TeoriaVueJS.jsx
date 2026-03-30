import { Link } from 'react-router-dom'
import '../docs/DocPage.css'

function TeoriaVueJS() {
  return (
    <div className="doc-page">
      <div className="doc-page__inner">

        <div className="doc-page__breadcrumb">
          <Link to="/docs">Docs</Link>
          <span>›</span>
          <span>Vue.js</span>
        </div>

        <div className="doc-page__header">
          <span className="doc-page__tipo doc-page__tipo--teoria">Teoría</span>
          <h1>💚 Vue.js</h1>
          <p>
            Vue.js es un framework progresivo de JavaScript para construir interfaces de usuario.
            Conocido por su curva de aprendizaje suave y su sistema de reactividad elegante.
          </p>
        </div>

        <div className="doc-page__content">

          <div className="doc-section">
            <h2>¿Qué es Vue?</h2>
            <p>
              Vue fue creado por Evan You en 2014. Sus características principales son:
            </p>
            <ul>
              <li><strong>Progresivo</strong>: podés adoptarlo gradualmente, desde una página simple hasta una app compleja.</li>
              <li><strong>Reactivo</strong>: el DOM se actualiza automáticamente cuando cambia el estado.</li>
              <li><strong>Single File Components (SFC)</strong>: template, script y estilos en un mismo archivo <code>.vue</code>.</li>
              <li><strong>Composition API</strong>: forma moderna de organizar la lógica (similar a los hooks de React).</li>
            </ul>
            <div className="doc-table-wrapper">
              <table className="doc-table">
                <thead>
                  <tr><th>Vue</th><th>React equivalente</th></tr>
                </thead>
                <tbody>
                  <tr><td><code>ref()</code> / <code>reactive()</code></td><td><code>useState()</code></td></tr>
                  <tr><td><code>computed()</code></td><td><code>useMemo()</code></td></tr>
                  <tr><td><code>watch()</code></td><td><code>useEffect()</code></td></tr>
                  <tr><td><code>onMounted()</code></td><td><code>useEffect(() => {}, [])</code></td></tr>
                  <tr><td><code>v-if</code> / <code>v-for</code></td><td>JSX con <code>&&</code> / <code>.map()</code></td></tr>
                  <tr><td>Pinia / Vuex</td><td>Context API / Redux / Zustand</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="doc-section">
            <h2>Estructura de un Single File Component</h2>
            <div className="code-block">
              <div className="code-block__header">
                <span className="code-block__label">Vue SFC</span>
              </div>
              <pre><code>{`<!-- Contador.vue -->
<template>
  <!-- El template: HTML con directivas Vue -->
  <div class="contador">
    <h2>Contador: {{ count }}</h2>
    <button @click="incrementar">+1</button>
    <button @click="count--">-1</button>
  </div>
</template>

<script setup>
// Composition API con <script setup> (forma moderna)
import { ref } from 'vue'

const count = ref(0)

function incrementar() {
  count.value++
}
</script>

<style scoped>
/* scoped: estilos solo para este componente */
.contador {
  padding: 20px;
  text-align: center;
}
</style>`}</code></pre>
            </div>
            <div className="alert alert--info">
              <span className="alert__icon">ℹ️</span>
              <span>En Vue, para acceder al valor de un <code>ref</code> dentro del script usás <code>.value</code>, pero en el template lo podés usar directamente sin <code>.value</code>.</span>
            </div>
          </div>

          <div className="doc-section">
            <h2>Reactividad: ref y reactive</h2>
            <div className="code-block">
              <div className="code-block__header">
                <span className="code-block__label">JavaScript (Vue)</span>
              </div>
              <pre><code>{`import { ref, reactive, computed } from 'vue'

// ref(): para valores primitivos (string, number, boolean)
const nombre = ref("Ana")
const edad = ref(25)
const activo = ref(true)

// Modificar un ref
nombre.value = "Carlos"
edad.value++

// reactive(): para objetos (no necesita .value en el script)
const usuario = reactive({
  nombre: "Laura",
  edad: 30,
  hobbies: []
})

usuario.nombre = "María"   // reactivo automáticamente
usuario.hobbies.push("yoga")

// computed(): valor derivado que se recalcula automáticamente
const nombreCompleto = computed(() => {
  return \`\${usuario.nombre} García\`
})

// nombreCompleto.value → "María García"`}</code></pre>
            </div>
          </div>

          <div className="doc-section">
            <h2>Directivas del template</h2>
            <div className="code-block">
              <div className="code-block__header">
                <span className="code-block__label">Vue Template</span>
              </div>
              <pre><code>{`<script setup>
import { ref } from 'vue'
const mostrar = ref(true)
const items = ref(["HTML", "CSS", "JavaScript"])
const texto = ref("")
</script>

<template>
  <!-- v-if / v-else: renderizado condicional -->
  <p v-if="mostrar">Visible</p>
  <p v-else>Oculto</p>

  <!-- v-show: muestra/oculta con CSS (el elemento existe en el DOM) -->
  <div v-show="mostrar">Siempre en DOM</div>

  <!-- v-for: renderizar listas -->
  <ul>
    <li v-for="(item, index) in items" :key="index">
      {{ index + 1 }}. {{ item }}
    </li>
  </ul>

  <!-- v-model: two-way binding en inputs -->
  <input v-model="texto" placeholder="Escribí algo..." />
  <p>Escribiste: {{ texto }}</p>

  <!-- v-bind (:): enlaza atributos dinámicamente -->
  <img :src="usuario.avatar" :alt="usuario.nombre" />
  <button :disabled="!texto">Enviar</button>

  <!-- v-on (@): escuchar eventos -->
  <button @click="handleClick">Click</button>
  <input @keyup.enter="enviar" />
  <form @submit.prevent="handleSubmit">...</form>
</template>`}</code></pre>
            </div>
          </div>

          <div className="doc-section">
            <h2>Componentes y Props</h2>
            <div className="code-block">
              <div className="code-block__header">
                <span className="code-block__label">Vue SFC</span>
              </div>
              <pre><code>{`<!-- Tarjeta.vue -->
<template>
  <div class="tarjeta">
    <h3>{{ titulo }}</h3>
    <p>{{ descripcion }}</p>
    <slot />  <!-- contenido que pasa el padre -->
  </div>
</template>

<script setup>
// defineProps: declara las props que acepta el componente
const props = defineProps({
  titulo: String,
  descripcion: {
    type: String,
    default: "Sin descripción"
  },
  activo: {
    type: Boolean,
    default: false
  }
})

// defineEmits: declara los eventos que puede emitir
const emit = defineEmits(["seleccionar", "eliminar"])

function handleClick() {
  emit("seleccionar", props.titulo)
}
</script>


<!-- App.vue - usando el componente -->
<template>
  <Tarjeta
    titulo="Vue.js"
    descripcion="Framework progresivo"
    :activo="true"
    @seleccionar="(t) => console.log(t)"
  >
    <p>Contenido extra (slot)</p>
  </Tarjeta>
</template>

<script setup>
import Tarjeta from './Tarjeta.vue'
</script>`}</code></pre>
            </div>
          </div>

          <div className="doc-section">
            <h2>Watchers y Ciclo de vida</h2>
            <div className="code-block">
              <div className="code-block__header">
                <span className="code-block__label">JavaScript (Vue)</span>
              </div>
              <pre><code>{`import { ref, watch, onMounted, onUnmounted } from 'vue'

const busqueda = ref("")
const resultados = ref([])

// watch: reacciona a cambios en una ref
watch(busqueda, async (nuevoValor) => {
  if (nuevoValor.length < 2) return
  const data = await buscar(nuevoValor)
  resultados.value = data
})

// Ciclo de vida
onMounted(() => {
  console.log("Componente montado en el DOM")
  // Buen lugar para hacer fetch inicial
})

onUnmounted(() => {
  console.log("Componente desmontado")
  // Limpiar timers, suscripciones, etc.
})`}</code></pre>
            </div>
          </div>

        </div>

        <div className="doc-page__nav">
          <Link to="/docs/teoria-react">← React.js</Link>
          <Link to="/docs/teoria-typescript">TypeScript →</Link>
        </div>

      </div>
    </div>
  )
}

export default TeoriaVueJS
