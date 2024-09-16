<template>
    <h2>
        <span v-for="(part, index) in textParts" :key="index">
          <span v-if="part.color" :style="{ color: part.color }">{{ part.text }}</span>
          <span v-else>{{ part.text }}</span>
        </span>
      </h2>
</template>
  
<script>
export default {
  props: {
    text: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      textParts: [],
    };
  },
  mounted() {
    this.parseText();
  },
  methods: {
    parseText() {
      const parts = this.text.split("{");
      this.textParts = parts.map((part, index) => {
        if (index === 0) {
          return { text: part };
        } else {
          const [color, text] = part.split("}");
          return { color: "#" + color, text };
        }
      });
    },
  },
};
</script>
  