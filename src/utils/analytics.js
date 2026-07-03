export const logArticleRead = (category) => {
  try {
    const rawData = localStorage.getItem('newscloud_analytics');
    let data = rawData ? JSON.parse(rawData) : {
      totalReads: 0,
      categories: {},
      history: [] 
    };

    data.totalReads += 1;

    const cat = category ? category.toLowerCase() : 'unknown';
    data.categories[cat] = (data.categories[cat] || 0) + 1;

    const today = new Date().toISOString().split('T')[0];
    const todayIndex = data.history.findIndex(h => h.date === today);
    if (todayIndex >= 0) {
      data.history[todayIndex].count += 1;
    } else {
      data.history.push({ date: today, count: 1 });
    }

    if (data.history.length > 30) {
      data.history = data.history.slice(data.history.length - 30);
    }

    localStorage.setItem('newscloud_analytics', JSON.stringify(data));
  } catch (err) {
    console.error("Failed to log analytics", err);
  }
};

export const getAnalyticsData = () => {
  try {
    const rawData = localStorage.getItem('newscloud_analytics');
    if (!rawData) return null;
    
    const data = JSON.parse(rawData);
    // Ensure backwards compatibility or default structure
    return {
      totalReads: data.totalReads || 0,
      categories: data.categories || {},
      history: data.history || []
    };
  } catch (err) {
    return null;
  }
};
