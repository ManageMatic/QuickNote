import React from 'react';
import '../styles/SkeletonCard.css';

const SkeletonCard = () => {
  return (
    <div className="skeleton-card glass">
      <div className="skeleton-header">
        <div className="skeleton-tag shimmer" />
        <div className="skeleton-icons">
          <div className="skeleton-icon shimmer" />
          <div className="skeleton-icon shimmer" />
        </div>
      </div>
      <div className="skeleton-body">
        <div className="skeleton-title shimmer" />
        <div className="skeleton-text shimmer" />
        <div className="skeleton-text shimmer short" />
      </div>
      <div className="skeleton-footer">
        <div className="skeleton-date shimmer" />
        <div className="skeleton-actions">
          <div className="skeleton-btn shimmer" />
          <div className="skeleton-btn shimmer" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
