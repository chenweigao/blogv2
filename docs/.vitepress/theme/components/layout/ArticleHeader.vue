<template>
  <div :class="$style.articleHeader">
    <div :class="$style.articleMetaSection">
      <ArticleMeta :show-reading-stats="false" />
    </div>
    
    <!-- 统计信息和操作按钮行 -->
    <div :class="$style.docActionsBar">
      <!-- 左侧：阅读统计 -->
      <div :class="$style.readingStatsSection">
        <ReadingStats />
      </div>
      
      <!-- 右侧：操作按钮组 -->
      <div :class="$style.actionButtons">
        <GitHistoryButton />
        <button 
          :class="[$style.tocQuickToggle, 'u-focus-ring', 'press-active', 'focus-ring-animated', 'hover-pop']"
          @click="$emit('toggle-quick-toc')"
          :title="showQuickTOC ? 'Hide Quick TOC' : 'Show Quick TOC'"
        >
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path d="M3 9h14V7H3v2zm0 4h14v-2H3v2zm0 4h14v-2H3v2zm16 0h2v-2h-2v2zm0-10v2h2V7h-2zm0 6h2v-2h-2v2z"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import ArticleMeta from '../ArticleMeta.vue'
import ReadingStats from '../ReadingStats.vue'
import GitHistoryButton from '../GitHistoryButton.vue'

defineProps({
  showQuickTOC: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle-quick-toc'])
</script>

<style module>
.articleHeader {
  margin-bottom: 1.5rem;
}

.articleMetaSection {
  margin-bottom: 1rem;
}

.docActionsBar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  gap: 2rem;
}

.readingStatsSection {
  flex: 1;
  display: flex;
  align-items: center;
}

.actionButtons {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.tocQuickToggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

@media (hover: hover) {
  .tocQuickToggle:hover {
    background: var(--vp-c-brand-soft);
    border-color: var(--vp-c-brand-1);
    color: var(--vp-c-brand-1);
  }
}

@media (max-width: 768px) {
  .docActionsBar {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .actionButtons {
    align-self: flex-end;
  }
}
</style>