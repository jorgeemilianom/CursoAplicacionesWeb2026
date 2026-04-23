import { useState, useRef, useEffect } from 'react'
import '../styles/ChatBot.css'

function ChatBot({ productos, addToCart }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hola 👋 ¿En qué te puedo ayudar?' },
  ])
  const [input, setInput] = useState('')
  const [pendingAction, setPendingAction] = useState(null)
  const messagesRef = useRef(null)

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [messages])

  const responder = (texto) => {
    const msg = texto.toLowerCase()

    if (pendingAction) {
      if (pendingAction.type === 'add_to_cart' && (msg.includes('si') || msg.includes('ok') || msg.includes('dale') || msg.includes('sí') || msg.includes('yes'))) {
        addToCart(pendingAction.product);
        setPendingAction(null);
        return `¡${pendingAction.product.name} agregado al carrito! 🛒`;
      } else if (msg.includes('no') || msg.includes('cancelar')) {
        setPendingAction(null);
        return 'Ok, no lo agrego.'
      } else {
        setPendingAction(null);
        // Proceed to normal response
      }
    }

    if (msg.includes("hola")) {
      return 'Hola 👋 Bienvenido a FERRETRIA EL VIEJO VITE'
    }

    if (msg.includes("producto")) {
      return 'Tenemos herramientas como taladros, martillos y mas 🔧'
    }

    if (msg.includes("precio")) {
      return 'Podes ver los precios en el catalogo 😉'
    }

    if (msg.includes("carrito")) {
      return 'Podes agregar productos con el boton 🛒'
    }

    if (msg.includes("marca")) {
      return 'Son genericas.'
    }

    if (msg.includes("medidas")) {
      return 'Medidas estandar.'
    }

    // 🔥 BONUS: usar datos reales de tu API
    if (msg.includes("barato")) {
      if (!productos || productos.length === 0) {
        return 'No encontre productos 😅'
      }
      const barato = productos.reduce((min, p) =>
        p.price < min.price ? p : min
      )
      return `El mas barato es ${barato.name} ($${barato.price})`
    }

    // Check for specific products
    const matchingProduct = productos?.find(p => {
      const productName = p.name.toLowerCase()
      return productName.includes(msg) || msg.includes(productName)
    })
    if (matchingProduct) {
      setPendingAction({ type: 'add_to_cart', product: matchingProduct })
      return `Si, tenemos ${matchingProduct.name} por $${matchingProduct.price}. ¿Queres agregarlo al carrito?`
    }

    return 'No entendi 🤔 proba con: productos, precio, carrito...'
  }

  const sendMessage = () => {
    if (!input.trim()) return

    const userMsg = { from: 'user', text: input }
    const botMsg = { from: 'bot', text: responder(input) }

    setMessages((currentMessages) => [...currentMessages, userMsg, botMsg])
    setInput('')
  }

  return (
    <div className="ferreteria-chatbot">
      {open && (
        <div className="ferreteria-chatbot__window">
          <div className="ferreteria-chatbot__header">
            <div className="ferreteria-chatbot__header-content">
              <span className="ferreteria-chatbot__badge">Asistente</span>
              <h3 className="ferreteria-chatbot__title">Don Bot</h3>
              <p className="ferreteria-chatbot__subtitle">Tu ayudante para encontrar herramientas, precios y compras</p>
            </div>
            <button className="ferreteria-chatbot__close" onClick={() => setOpen(false)} aria-label="Cerrar chat">✕</button>
          </div>

          <div ref={messagesRef} className="ferreteria-chatbot__messages">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`ferreteria-chatbot__message ferreteria-chatbot__message--${m.from}`}
              >
                <span className="ferreteria-chatbot__message-text">{m.text}</span>
              </div>
            ))}
          </div>

          <div className="ferreteria-chatbot__composer">
            <input
              className="ferreteria-chatbot__field"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  sendMessage()
                }
              }}
              placeholder="Necesito algo..."
            />
            <button className="ferreteria-chatbot__send" onClick={sendMessage}>Enviar</button>
          </div>
        </div>
      )}

      <button
        className="ferreteria-chatbot__toggle"
        onClick={() => setOpen(!open)}
      >
        💬
      </button>
    </div>
  )
}

export default ChatBot
