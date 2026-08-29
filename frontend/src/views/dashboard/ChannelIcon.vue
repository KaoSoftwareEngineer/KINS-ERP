<template>
  <span class="ch-ic" :title="channel">
    <!-- LINE -->
    <svg v-if="channel === 'line'" viewBox="0 0 40 40"><rect width="40" height="40" rx="9" fill="#06C755"/><text x="20" y="25.5" font-size="11.5" font-weight="800" fill="#fff" text-anchor="middle" font-family="Arial, sans-serif" letter-spacing="-.5">LINE</text></svg>
    <!-- WhatsApp -->
    <svg v-else-if="channel === 'whatsapp'" viewBox="0 0 40 40"><rect width="40" height="40" rx="9" fill="#25D366"/><path fill="#fff" d="M20 10.5a9.5 9.5 0 0 0-8.1 14.4L10.7 29l4.3-1.1a9.5 9.5 0 1 0 5-17.4zm0 1.9a7.6 7.6 0 0 1 0 15.2 7.6 7.6 0 0 1-3.9-1.1l-.3-.2-2.5.7.7-2.4-.2-.3a7.6 7.6 0 0 1 6.2-11.9z"/><path fill="#fff" d="M16.7 15.6c-.2-.4-.3-.4-.5-.4h-.5c-.1 0-.4 0-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.4c.1.1 1.6 2.5 3.9 3.4 1.9.8 2.3.6 2.7.6.4 0 1.3-.5 1.5-1.1.2-.5.2-1 .1-1.1l-.5-.2c-.3-.1-1.4-.7-1.6-.7-.2-.1-.4-.1-.5.1l-.6.8c-.1.2-.2.2-.5.1-.2-.1-1-.4-1.9-1.1-.7-.6-1.1-1.3-1.3-1.5-.1-.2 0-.4.1-.5l.4-.4c.1-.1.1-.2.2-.4v-.4c0-.1-.5-1.4-.7-1.9z"/></svg>
    <!-- Facebook -->
    <svg v-else-if="channel === 'facebook'" viewBox="0 0 40 40"><rect width="40" height="40" rx="9" fill="#1877F2"/><path fill="#fff" d="M23 21.5l.6-3.6h-3.5v-2.3c0-1 .5-2 2.1-2H24v-3.1s-1.4-.3-2.8-.3c-2.8 0-4.7 1.7-4.7 4.9v2.8h-3.2v3.6h3.2V30h4v-8.5H23z"/></svg>
    <!-- โทรศัพท์ -->
    <svg v-else-if="channel === 'phone'" viewBox="0 0 40 40"><rect width="40" height="40" rx="9" fill="#5b8def"/><path fill="#fff" d="M26.5 24.7c-1.2 0-2.5-.2-3.6-.6-.4-.1-.8 0-1.1.3l-1.6 1.6c-2.7-1.4-4.9-3.6-6.3-6.3l1.6-1.6c.3-.3.4-.7.3-1.1-.4-1.1-.6-2.3-.6-3.6 0-.6-.5-1.1-1.1-1.1h-2.5c-.6 0-1.1.5-1.1 1.1 0 8.6 7 15.6 15.6 15.6.6 0 1.1-.5 1.1-1.1v-2.5c0-.6-.5-1.2-1.1-1.2z"/></svg>
    <!-- หน้าร้าน -->
    <svg v-else-if="channel === 'walkin'" viewBox="0 0 40 40"><rect width="40" height="40" rx="9" fill="#8a63d2"/><path fill="#fff" d="M12.5 12.5h15l1.3 4.2c.2 1.5-1 2.8-2.5 2.8-1.2 0-2.2-.8-2.5-1.9-.3 1.1-1.3 1.9-2.5 1.9s-2.2-.8-2.5-1.9c-.3 1.1-1.3 1.9-2.5 1.9-1.5 0-2.7-1.3-2.5-2.8l1.2-4.2zM13.5 21c.5.2 1 .3 1.5.3.9 0 1.8-.3 2.5-.9.7.6 1.6.9 2.5.9s1.8-.3 2.5-.9c.7.6 1.6.9 2.5.9.5 0 1-.1 1.5-.3v6.5c0 .3-.2.5-.5.5h-4.5v-4h-3.5v4h-4c-.3 0-.5-.2-.5-.5V21z"/></svg>
    <!-- อื่นๆ -->
    <svg v-else viewBox="0 0 40 40"><rect width="40" height="40" rx="9" fill="#9aa0ac"/><path fill="#fff" d="M13 15h14c.6 0 1 .4 1 1v8c0 .6-.4 1-1 1H13c-.6 0-1-.4-1-1v-8c0-.6.4-1 1-1zm.8 2 6.2 3.7L26.2 17H13.8zM27 18.4l-7 4.1-7-4.1V24h14v-5.6z"/></svg>
  </span>
</template>

<script>
export default {
  name: 'ChannelIcon',
  props: { channel: { type: String, default: 'other' } },
};
</script>

<style scoped>
.ch-ic { display: inline-flex; width: 18px; height: 18px; flex-shrink: 0; }
.ch-ic svg { width: 100%; height: 100%; display: block; }
</style>
