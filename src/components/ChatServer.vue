<template>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap" rel="stylesheet">
  <div class="hello" v-if="visible_chat">
    <div class="div-messages">
      <div ref="scrollContainer" :style="overflowStyle" class="div_list">
        <ColoredText v-for="(item, index) in text" :key="index" :text="item"/>
      </div>
    </div>
  </div>
  
  <input @input="moveCursorToEnd" @keyup="handleKeyUp" @keydown="handleKeydown" v-if="visible_input" ref="inputField" v-model="input_text" placeholder="" />
</template>

<script scoped>
import ColoredText from './ColoredText.vue';

export default {
  data() {
    return {
      index_select: 0,
      afther_texts: ["", "/veh tenf"],
      text: ["msg"],
      input_text: "",
      visible_input: false,
      visible_chat: true,
    };
  },
  mounted() {
    this.scrollToBottom();
    document.addEventListener('keydown', this.OnKeyPessed);
    window.alt?.on("chat:sendmessage", (msg) => {
      this.text.push(msg);
      this.$nextTick(this.scrollToBottom);
    });

    window.alt?.on("chat:visible", (option) => {
      if(!this.visible_input){
        this.visible_chat = option;
        window.alt.emit("chat:off");
      }
    });
  },
  created() {
    if (this.text.length >= 30) this.text.shift();
  },
  updated() {
    if(this.visible_input) this.scrollToBottom();
  },
  computed: {
    overflowStyle() {
      return {
        overflow: this.visible_input ? 'auto' : 'hidden'
      };
    }
  },
  components: {
    ColoredText
  },
  methods: {
    moveCursorToEnd() {
      const input = this.$refs.inputField;
      const length = input.value.length;
      // Mueve el cursor al final del texto
      input.setSelectionRange(length, length);
    },
    IsColor(texto) {
      const regex = /\{[0-9a-fA-F]{6}\}/;
      return regex.test(texto);
    },
    DeleteColor(texto) {
      const regex = /\{[0-9a-fA-F]{6}\}/g;
      return texto.replace(regex, '');
    },
    pushMessage() {
      this.visible_input = false;
      window.alt.emit("controls:on");

      if (this.IsColor(this.input_text)) {
          this.input_text = this.DeleteColor(this.input_text);
      }

      // Limitar la longitud del mensaje
      if (this.input_text.length >= 100) {
          this.input_text = '';
          return;
      }

      if (this.input_text.trim() === '') {
          this.input_text = '';
          return;
      }

      // Emitir el comando o agregar el mensaje al chat
      if (this.input_text[0] === "/") {
          window.alt.emit("onCommandChat", this.input_text);
      } else {
          this.text.push(this.input_text);
      }

      // Agregar a afther_texts
      this.afther_texts.push(this.input_text);

      // Limpiar el nuevo ítem y hacer scroll hacia abajo
      this.input_text = '';
      this.$nextTick(this.scrollToBottom);
  },
    scrollToBottom() {
      const container = this.$refs.scrollContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },
    OnKeyPessed(event) {

      if(event.key === ' ' && !this.visible_input) {
        return event.preventDefault();
      }
      if (event.key === "t" && !this.visible_input && this.visible_chat) {
        event.preventDefault();
        this.visible_input = true;
        this.$nextTick(() => {
          this.$refs.inputField?.focus()
        });
        this.index_select = this.afther_texts.length-1;
      }
    },
    handleKeyUp(event){
      if(this.visible_input && event.key == 'ArrowUp'){
        if(this.afther_texts.length == 0 || this.index_select < 0) {
          this.moveCursorToEnd();
          return;
        }
        this.input_text = this.afther_texts[this.index_select];
        this.index_select -= 1;
        this.$nextTick(() => {
          this.moveCursorToEnd();
        });
      }
    },
    handleKeydown(event) {
      if (event.key === "Enter") {
        this.pushMessage();
      }
    }
  },
};
</script>

<style>

.div-messages {
  width: 100%;
}

.hello {
  height: 200px;
  display: flex;
  flex-direction: column-reverse;
  overflow: hidden;
}

input {
  color: white;
  background: rgba(21, 21, 21, 0.5);
  font-family: 'JetBrains Mono', monospace;
  border-radius: 0%;
  border: none;
  outline: none;
  width: 50%;
  height: 40px;
  position: absolute;
}

span {
  font-family: 'JetBrains Mono', monospace;
  margin: 0%;
  margin-bottom: 1px;
  position: relative;
  width: 100%;
  height: 20px;
  text-shadow: 
        -1px -1px 0 black,   /* Borde superior e izquierdo */
        1px -1px 0 black,    /* Borde superior y derecho */
        -1px 1px 0 black,    /* Borde inferior e izquierdo */
        1px 1px 0 black;     /* Borde inferior y derecho */
  
  color: white;
  user-select: none;
}

h2 {
  font-size: 80%;
  font-family: 'JetBrains Mono', monospace;
  margin: 0%;
  margin-bottom: 2px;
  position: relative;
  width: 100%;
  height: 20px;
  text-shadow: 
        -1px -1px 0 black,   /* Borde superior e izquierdo */
        1px -1px 0 black,    /* Borde superior y derecho */
        -1px 1px 0 black,    /* Borde inferior e izquierdo */
        1px 1px 0 black;     /* Borde inferior y derecho */
  
  color: white;
  user-select: none;
  animation: fadeIn 200ms ease;
}

@keyframes fadeIn {
  from {
    opacity: 0; /* Comienza con opacidad 0 */
    transform: translateY(-20px); /* Comienza 20px arriba */
  }
  to {
    opacity: 1; /* Termina con opacidad 1 */
    transform: translateY(0); /* Termina en su posición original */
  }
}

h3 {
  margin: 40px 0 0;
}

.div_list {
  display: flex;
  flex-wrap: wrap;
  padding: 0;
  margin: 0;
  width: 95%;
  max-height: -webkit-fill-available;
  text-align: left;
  outline: none;
}

.div_list::-webkit-scrollbar {
  display: none; /* Oculta la barra de desplazamiento en navegadores basados en WebKit */
}
</style>