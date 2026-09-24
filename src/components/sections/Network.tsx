'use client';
import { useCopy } from '@/components/SiteCopyProvider';
import Link from '@/components/Link';
import { useState } from 'react';
import type { Section, Global } from '@/lib/types';
import { safeHref } from '@/lib/media';
import { Photo, Highlight } from '../ui';
import { UiIcon } from '../icons';

export default function Network({ section, global }: { section: Section; global?: Global }) {
  const copy = useCopy();
  const [zoom, setZoom] = useState(1);
  const [live, setLive] = useState(false);
  const office = section.cards?.[0];
  const query = encodeURIComponent(office?.description || global?.address || '');
  const embed = section.mapUrl?.startsWith('https://www.google.com/maps/embed')
    ? section.mapUrl
    : `https://maps.google.com/maps?q=${query}&z=${Math.round(12 + (zoom - 1) * 4)}&output=embed`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${query}`;
  return (
    <section className="network-section">
      <div className="container network-inner">
        <header className="network-head">
          {section.eyebrow && (
            <p className="lined-eyebrow">
              <span aria-hidden="true" />
              {section.eyebrow}
              <span aria-hidden="true" />
            </p>
          )}
          {section.title && (
            <h2>
              <Highlight text={section.title} phrase={section.highlight} />
            </h2>
          )}
          {section.description && <p>{section.description}</p>}
        </header>
        <div className="network-map">
          {live ? (
            <iframe
              src={embed}
              title={office?.title || section.title || 'Map'}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          ) : (
            <button type="button" className="map-mock" onClick={() => setLive(true)} aria-label={copy.common.viewGoogleMaps}>
              <span className="map-layer" style={{ transform: `scale(${zoom})` }}>
                <Photo picture={section.image} />
                <i className="map-marker main" style={{ left: '51.3%', top: '40.3%' }} />
                <i className="map-marker" style={{ left: '41.4%', top: '33.5%' }} />
                <i className="map-marker" style={{ left: '67.4%', top: '26.5%' }} />
              </span>
              <span className="map-hint">{copy.common.viewGoogleMaps}</span>
            </button>
          )}
          {office && (
            <div className="map-office">
              <div className="map-office-head">
                <div>
                  <h3>{office.title}</h3>
                  <p>{office.description}</p>
                </div>
                <a href={directions} target="_blank" rel="noopener noreferrer" aria-label={copy.common.directions}>
                  <UiIcon name="pin" />
                </a>
              </div>
              <div className="map-office-foot">
                {section.rating && (
                  <>
                    <strong>{section.rating}</strong>
                    <UiIcon name="star" size={14} />
                    <span aria-hidden="true">|</span>
                  </>
                )}
                <Link href={safeHref(section.ctaHref || copy.routes.siteSurvey)}>
                  {section.ctaLabel || copy.forms.siteSurvey} →
                </Link>
              </div>
            </div>
          )}
          <div className="map-controls">
            <button
              type="button"
              aria-label={copy.accessibility.zoomIn}
              disabled={zoom >= 2}
              onClick={() => setZoom((z) => Math.min(2, z + 0.25))}
            >
              +
            </button>
            <span aria-hidden="true" />
            <button
              type="button"
              aria-label={copy.accessibility.zoomOut}
              disabled={zoom <= 1}
              onClick={() => setZoom((z) => Math.max(1, z - 0.25))}
            >
              −
            </button>
          </div>
          {!live && section.supportLabel && <span className="map-credit">{section.supportLabel}</span>}
        </div>
      </div>
    </section>
  );
}
