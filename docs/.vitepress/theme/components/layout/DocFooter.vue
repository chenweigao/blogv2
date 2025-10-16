<template>
  <div :class="$style.docFooterEnhancements">
    <!-- 文档底部信息 -->
    <div :class="$style.docBottomInfo">
      <div :class="$style.docStats">
        <span :class="$style.statItem">{{ wordCount }} words</span>
        <span :class="$style.statItem">{{ readingTime }} min read</span>
        <span v-if="lastModified" :class="$style.statItem">
          Updated: {{ formatDate(lastModified) }}
        </span>
      </div>
    </div>

    <!-- 相关文章推荐 -->
    <div v-if="relatedArticles.length > 0" :class="$style.relatedArticles">
      <h3 :class="$style.relatedTitle">Related Articles</h3>
      <div :class="$style.relatedList">
        <a 
          v-for="article in relatedArticles" 
          :key="article.link"
          :href="article.link"
          :class="[$style.relatedItem, 'u-focus-ring']"
        >
          <div :class="$style.relatedItemTitle">{{ article.title }}</div>
          <div :class="$style.relatedItemDesc">{{ article.description }}</div>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  wordCount: {
    type: Number,
    default: 0
  },
  readingTime: {
    type: Number,
    default: 0
  },
  lastModified: {
    type: String,
    default: ''
  },
  relatedArticles: {
    type: Array,
    default: () => []
  }
})

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style module>
.docFooterEnhancements {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--vp-c-divider);
}

.docBottomInfo {
  margin-bottom: 2rem;
}

.docStats {
  display: flex;
  gap: 1.5rem;
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
  flex-wrap: wrap;
}

.statItem {
  display: flex;
  align-items: center;
}

.relatedArticles {
  margin-top: 2rem;
}

.relatedTitle {
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  color: var(--vp-c-text-1);
}

.relatedList {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.relatedItem {
  display: block;
  padding: 1rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  text-decoration: none;
  transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease, color 0.2s ease;
}

.relatedItem:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.relatedItemTitle {
  font-weight: 500;
  color: var(--vp-c-text-1);
  margin-bottom: 0.5rem;
}

.relatedItemDesc {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  line-height: 1.4;
}

@media (max-width: 768px) {
  .docStats {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .relatedList {
    grid-template-columns: 1fr;
  }
}
</style>