<template>
  <div
    v-if="isOpen && imageUrl"
    class="modal-overlay modal-overlay--dark"
    @click="$emit('close')"
  >
    <div class="modal-card modal-card--image" @click.stop>
      <header class="modal-card__header">
        <h2>Document Image</h2>
        <button
          type="button"
          class="modal-close-button"
          @click="$emit('close')"
        >
          ×
        </button>
      </header>
      <div class="image-modal__content">
        <img :src="imageUrl" alt="Document" class="image-modal__image" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ImageModal",
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    imageUrl: {
      type: String,
      default: "",
    },
  },
  emits: ["close"],
};
</script>
