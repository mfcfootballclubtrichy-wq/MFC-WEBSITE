/**
 * ConfirmBadge.jsx — Visual marker for unverified content.
 *
 * Renders a gold "[CONFIRM]" badge next to any content that has not yet
 * been verified by the club. Remove by passing confirm={false} or omitting
 * the badge once the club confirms the item.
 *
 * Usage:
 *   <ConfirmBadge />
 *   <ConfirmBadge label="[CONFIRM full address]" />
 */
import { useTranslation } from 'react-i18next';

export default function ConfirmBadge({ label }) {
  const { t } = useTranslation();

  return (
    <span className="badge--confirm" title="This information needs club confirmation">
      ⚠ {label ?? t('common.confirmBadge')}
    </span>
  );
}
