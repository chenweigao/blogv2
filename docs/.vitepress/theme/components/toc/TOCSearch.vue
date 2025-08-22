<template>
  <div class="toc-search" v-if="showSearch">
    <div class="search-input-wrapper">
      <svg class="search-icon" viewBox="0 0 24 24" width="16" height="16">
        <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
      </svg>
      <input
        ref="searchInput"
        v-model="searchQuery"
        type="text"
        class="search-input"
        :placeholder="placeholder"
        @input="handleInput"
        @keydown.escape="clearSearch"
        @keydown.enter="handleEnter"
        @keydown.arrow-down="handleArrowDown"
        @keydown.arrow-up="handleArrowUp"
      />
      <button
        v-if="searchQuery"
        class="search-clear"
        @click="clearSearch"
        :title="'Clear search'"
        :aria-label="'Clear search'"
      >
        <svg viewBox="0 0 24 24" width="14" height="14">
          <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
        </svg>
      </button>
    </div>
    
    <!-- Search Results Count -->
    <div class="search-results-info" v-if="searchQuery">
      <span class="results-count">
        {{ filteredCount }} of {{ totalCount }} headings
      </span>
      <span class="search-tips" v-if="filteredCount === 0">
        Try different keywords
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, watch } from 'vue'

const props = defineProps({
  showSearch: {
    type: Boolean,
    default: true
  },
  placeholder: {
    type: String,
    default: 'Search headings...'
  },
  totalCount: {
    type: Number,
    default: 0
  },
  filteredCount: {
    type: Number,
    default: 0
  },
  debounceDelay: {
    type: Number,
    default: 300
  }
})

const emit = defineEmits(['search', 'clear', 'enter', 'arrow-down', 'arrow-up'])

const searchInput = ref(null)
const searchQuery = ref('')
let debounceTimer = null

const handleInput = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    emit('search', searchQuery.value)
  }, props.debounceDelay)
}

const clearSearch = () => {
  searchQuery.value = ''
  emit('clear')
  searchInput.value?.focus()
}

const handleEnter = (event) => {
  emit('enter', event)
}

const handleArrowDown = (event) => {
  event.preventDefault()
  emit('arrow-down', event)
}

const handleArrowUp = (event) => {
  event.preventDefault()
  emit('arrow-up', event)
}

const focus = () => {
  nextTick(() => {
    searchInput.value?.focus()
  })
}

const blur = () => {
  searchInput.value?.blur()
}

const setValue = (value) => {
  searchQuery.value = value
}

// 监听搜索查询变化
watch(searchQuery, (newValue) => {
  if (!newValue) {
    emit('clear')
  }
})

defineExpose({
  focus,
  blur,
  setValue,
  searchQuery: computed(() => searchQuery.value)
})
</script>

<style scoped>
.toc-search {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  transition: all 0.2s ease;
}

.search-input-wrapper:focus-within {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 2px var(--vp-c-brand-soft);
}

.search-icon {
  margin-right: 0.5rem;
  color: var(--vp-c-text-3);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: var(--vp-c-text-1);
  font-size: 0.875rem;
  line-height: 1.4;
}

.search-input::placeholder {
  color: var(--vp-c-text-3);
}

.search-clear {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-left: 0.5rem;
  background: var(--vp-c-bg-soft);
  border: none;
  border-radius: 4px;
  color: var(--vp-c-text-3);
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.search-clear:hover {
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-1);
}

.search-results-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

.results-count {
  font-weight: 500;
}

.search-tips {
  font-style: italic;
  opacity: 0.8;
}

/* 搜索高亮动画 */
@keyframes searchHighlight {
  0% {
    background-color: transparent;
  }
  50% {
    background-color: var(--vp-c-brand-soft);
  }
  100% {
    background-color: transparent;
  }
}

.search-input-wrapper:focus-within {
  animation: searchHighlight 0.3s ease;
}

/* 响应式设计 */
@media (max-width: 640px) {
  .toc-search {
    padding: 0.5rem 0.75rem;
  }
  
  .search-input-wrapper {
    padding: 0.375rem 0.5rem;
  }
  
  .search-input {
    font-size: 0.8125rem;
  }
  
  .search-results-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
}

/* 暗色主题适配 */
.dark .search-input-wrapper:focus-within {
  box-shadow: 0 0 0 2px rgba(var(--vp-c-brand-rgb), 0.3);
}

/* 减少动画 */
@media (prefers-reduced-motion: reduce) {
  .search-input-wrapper,
  .search-clear {
    transition: none !important;
  }
  
  .search-input-wrapper:focus-within {
    animation: none !important;
  }
}
</style>