import React, { useState } from 'react';

const resourcesData = [
  {
    id: 1,
    category: 'Calculators',
    title: 'Carbon Footprint Calculator',
    description: 'Estimate your personal CO2 emissions from daily activities like travel, diet, and energy use.',
    url: 'https://www.carbonfootprint.com/calculator.aspx',
    icon: '🌍',
  },
  {
    id: 2,
    category: 'Calculators',
    title: 'Water Usage Calculator',
    description: 'Calculate your household water consumption and identify savings opportunities.',
    url: 'https://www.watercalculator.org/',
    icon: '💧',
  },
  {
    id: 3,
    category: 'Informative',
    title: 'How to Recycle Properly',
    description: 'A comprehensive guide to recycling practices and common mistakes to avoid.',
    url: 'https://www.recycling.com/',
    icon: '♻️',
  },
  {
    id: 4,
    category: 'Tools',
    title: 'Ecosia - Eco-Friendly Search Engine',
    description: 'Use Ecosia to plant trees while you search the web with their green-powered search engine.',
    url: 'https://www.ecosia.org/',
    icon: '🌳',
  },
  {
    id: 5,
    category: 'Videos',
    title: 'Sustainability Explained',
    description: 'Educational video on sustainable living and environmental impact by TED-Ed.',
    url: 'https://www.youtube.com/watch?v=GdzUlRfN-ck',
    icon: '🎥',
  },
  {
    id: 6,
    category: 'Educational',
    title: 'Climate Change Facts & Figures',
    description: 'Get up-to-date climate science insights from NASA’s official website.',
    url: 'https://climate.nasa.gov/evidence/',
    icon: '📊',
  },
];

export default function ResourcesPage() {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const categories = ['All', ...new Set(resourcesData.map(r => r.category))];

  const filteredResources = resourcesData.filter(resource => {
    const matchesCategory = filterCategory === 'All' || resource.category === filterCategory;
    const matchesSearch = resource.title.toLowerCase().includes(search.toLowerCase()) ||
      resource.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '1rem' }}>
      <h2 style={{ color: '#2a5934', marginBottom: 8 }}>Resources</h2>
      <p style={{ color: '#385f44', marginBottom: 20 }}>Useful tools, calculators, and educational content to help you live sustainably.</p>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            style={{
              padding: '6px 14px',
              borderRadius: 12,
              border: '1px solid #2e804a',
              backgroundColor: filterCategory === cat ? '#2e804a' : 'white',
              color: filterCategory === cat ? 'white' : '#2e804a',
              cursor: 'pointer',
              fontWeight: 600,
              boxShadow: filterCategory === cat ? '0 0 6px rgba(46,128,74,0.3)' : 'none',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <input
        type="search"
        placeholder="Search resources..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          width: '100%',
          padding: 12,
          borderRadius: 12,
          border: '1px solid rgba(53,114,73,0.2)',
          marginBottom: 20,
          fontSize: 16,
          color: '#2a5934',
        }}
        aria-label="Search resources"
      />

      {filteredResources.length === 0 ? (
        <p style={{ color: '#567e66' }}>No resources found.</p>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {filteredResources.map(({ id, title, description, url, icon, category }) => (
            <a
              key={id}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                gap: 16,
                padding: 20,
                border: '1px solid rgba(46,128,74,0.25)',
                borderRadius: 12,
                backgroundColor: 'white',
                textDecoration: 'none',
                color: '#2a5934',
                boxShadow: '0 1px 3px rgba(46,128,74,0.1)',
                alignItems: 'center',
                transition: 'box-shadow 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 10px rgba(46,128,74,0.3)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 3px rgba(46,128,74,0.1)')}
            >
              <div style={{ fontSize: 40, lineHeight: 1 }}>{icon}</div>
              <div>
                <h3 style={{ margin: '0 0 6px 0', fontWeight: 700 }}>{title}</h3>
                <p style={{ margin: 0, color: '#567e66' }}>{description}</p>
                <small style={{ marginTop: 6, display: 'inline-block', color: '#2e804a', fontWeight: '600' }}>{category}</small>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
