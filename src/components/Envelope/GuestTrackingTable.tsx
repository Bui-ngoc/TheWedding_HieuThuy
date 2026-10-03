import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  Copy,
  Plus,
  Search,
  Trash2,
  RefreshCw,
  Eye,
  Link2,
  ExternalLink,
  ShieldCheck,
  Check
} from 'lucide-react';
import {
  GuestTracking,
  TrackingData,
  getTrackingData,
  addInvitedGuest,
  deleteInvitedGuest,
  generateGuestLinks
} from '../../services/trackingService';
import './GuestTrackingTable.css';

interface GuestTrackingTableProps {
  onCopySuccess?: (msg: string) => void;
}

export const GuestTrackingTable: React.FC<GuestTrackingTableProps> = ({ onCopySuccess }) => {
  const [data, setData] = useState<TrackingData>({ generalViews: 0, guests: [] });
  const [loading, setLoading] = useState(false);
  const [inputName, setInputName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'opened' | 'unopened'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load tracking data on mount
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getTrackingData();
      setData(res);
    } catch (e) {
      console.error('Error loading tracking data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<TrackingData>;
      if (customEvent.detail) {
        setData(customEvent.detail);
      } else {
        loadData();
      }
    };

    window.addEventListener('tracking_data_updated', handleUpdate);

    // Auto refresh every 15 seconds to see live view updates when guests open link
    const timer = setInterval(() => {
      loadData();
    }, 15000);

    return () => {
      window.removeEventListener('tracking_data_updated', handleUpdate);
      clearInterval(timer);
    };
  }, []);

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName.trim()) return;

    try {
      const { data: updatedData, newGuest } = await addInvitedGuest(inputName);
      setData(updatedData);
      setInputName('');
      
      const links = generateGuestLinks(newGuest.name);
      // Auto copy standard link to clipboard
      navigator.clipboard.writeText(links.queryUrl).catch(() => {});
      
      if (onCopySuccess) {
        onCopySuccess(`Đã tạo link & sao chép cho "${newGuest.name}"!`);
      }
    } catch (err) {
      console.error('Error adding guest:', err);
    }
  };

  const handleDeleteGuest = async (guestId: string, guestName: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa link mời của "${guestName}"?`)) {
      try {
        const updatedData = await deleteInvitedGuest(guestId);
        setData(updatedData);
      } catch (err) {
        console.error('Error deleting guest:', err);
      }
    }
  };

  const handleCopyLink = (guest: GuestTracking, urlType: 'pretty' | 'query' = 'query', e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const links = generateGuestLinks(guest.name);
    const targetUrl = urlType === 'pretty' ? links.prettyUrl : links.queryUrl;

    navigator.clipboard.writeText(targetUrl).then(() => {
      setCopiedId(guest.id + '-' + urlType);
      setTimeout(() => setCopiedId(null), 2000);
      if (onCopySuccess) {
        onCopySuccess(`Đã sao chép link mời: "${guest.name}"!`);
      }
    }).catch(() => {
      if (onCopySuccess) {
        onCopySuccess(`Link: ${targetUrl}`);
      }
    });
  };

  // Filter & Search computation
  const filteredGuests = useMemo(() => {
    return data.guests.filter((g) => {
      const matchesSearch =
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.slug.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeFilter === 'opened') return g.opened;
      if (activeFilter === 'unopened') return !g.opened;

      return true;
    });
  }, [data.guests, searchQuery, activeFilter]);

  // Statistics calculation
  const totalGuests = data.guests.length;
  const openedGuestsCount = data.guests.filter((g) => g.opened).length;
  const unopenedGuestsCount = totalGuests - openedGuestsCount;
  const totalGuestOpenCount = data.guests.reduce((sum, g) => sum + (g.openCount || 0), 0);
  const totalOverallViews = (data.generalViews || 0) + totalGuestOpenCount;

  return (
    <div className="guest-tracking-card-container">
      {/* Header Banner */}
      <div className="tracking-header">
        <div className="tracking-header-left">
          <div className="tracking-badge">
            <ShieldCheck size={16} /> CHỈ HIỂN THỊ Ở LINK CHUNG
          </div>
          <h3 className="tracking-title">
            <Eye size={22} className="tracking-icon" /> Thống Kê & Quản Lý Lượt Mở Thiệp
          </h3>
        </div>
        <button
          className={`tracking-refresh-btn ${loading ? 'spinning' : ''}`}
          onClick={loadData}
          title="Tải lại dữ liệu lượt mở"
        >
          <RefreshCw size={16} />
          <span>Cập nhật</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="tracking-stats-grid">
        <div className="stat-card total-views">
          <div className="stat-icon-wrapper">
            <Eye size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Tổng lượt mở thiệp</span>
            <span className="stat-value">{totalOverallViews} <small>lượt</small></span>
          </div>
        </div>

        <div className="stat-card total-guests">
          <div className="stat-icon-wrapper">
            <Users size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Đã tạo link mời</span>
            <span className="stat-value">{totalGuests} <small>người</small></span>
          </div>
        </div>

        <div className="stat-card opened-guests">
          <div className="stat-icon-wrapper">
            <CheckCircle2 size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Khách đã mở thiệp</span>
            <span className="stat-value text-green">
              {openedGuestsCount} <small>({totalGuests > 0 ? Math.round((openedGuestsCount / totalGuests) * 100) : 0}%)</small>
            </span>
          </div>
        </div>

        <div className="stat-card unopened-guests">
          <div className="stat-icon-wrapper">
            <Clock size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Chưa mở thiệp</span>
            <span className="stat-value text-amber">{unopenedGuestsCount} <small>người</small></span>
          </div>
        </div>
      </div>

      {/* Quick Add Invited Guest Form */}
      <form className="add-guest-form" onSubmit={handleAddGuest}>
        <div className="add-input-group">
          <div className="input-with-icon">
            <Link2 size={18} className="field-icon" />
            <input
              type="text"
              placeholder="Nhập tên khách mời (VD: Bạn Linh, Anh Nam, Gia đình Chị Hoa)..."
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              className="add-guest-input"
            />
          </div>
          <button type="submit" className="add-guest-btn">
            <Plus size={18} />
            <span>Tạo Link Mời</span>
          </button>
        </div>
      </form>

      {/* Filter Tabs & Search Bar */}
      <div className="tracking-controls-row">
        <div className="filter-tabs">
          <button
            className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            Tất cả ({totalGuests})
          </button>
          <button
            className={`filter-tab tab-opened ${activeFilter === 'opened' ? 'active' : ''}`}
            onClick={() => setActiveFilter('opened')}
          >
            ✅ Đã xem ({openedGuestsCount})
          </button>
          <button
            className={`filter-tab tab-unopened ${activeFilter === 'unopened' ? 'active' : ''}`}
            onClick={() => setActiveFilter('unopened')}
          >
            ⏳ Chưa xem ({unopenedGuestsCount})
          </button>
        </div>

        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Tìm tên khách..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="tracking-table-wrapper">
        {filteredGuests.length === 0 ? (
          <div className="empty-tracking-state">
            <Users size={36} />
            <p>
              {totalGuests === 0
                ? 'Chưa có link mời riêng nào được tạo. Hãy nhập tên khách mời ở trên để tạo link và theo dõi ai đã xem thiệp!'
                : 'Không tìm thấy khách mời nào phù hợp với bộ lọc.'}
            </p>
          </div>
        ) : (
          <table className="guest-tracking-table">
            <thead>
              <tr>
                <th style={{ width: '50px' }}>STT</th>
                <th>Tên Khách Mời</th>
                <th>Link Mời Cho Khách</th>
                <th>Trạng Thái Xem</th>
                <th>Lượt Mở</th>
                <th style={{ width: '130px', textAlign: 'center' }}>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredGuests.map((guest, idx) => {
                const links = generateGuestLinks(guest.name);
                const isCopiedQuery = copiedId === guest.id + '-query';
                const isCopiedPretty = copiedId === guest.id + '-pretty';

                return (
                  <tr key={guest.id} className={guest.opened ? 'row-opened' : 'row-unopened'}>
                    <td className="col-stt">{idx + 1}</td>
                    <td className="col-name">
                      <div className="guest-name-cell">
                        <span className="guest-display-name">{guest.name}</span>
                        <span className="guest-slug-tag">/{links.slug}</span>
                      </div>
                    </td>
                    <td className="col-link">
                      <div className="link-cell-group">
                        <div className="url-preview-text" title={links.queryUrl}>
                          {links.queryUrl}
                        </div>
                        <div className="quick-link-copy-btns">
                          <button
                            type="button"
                            className={`btn-mini-copy ${isCopiedQuery ? 'copied' : ''}`}
                            onClick={(e) => handleCopyLink(guest, 'query', e)}
                            title="Sao chép link theo tham số"
                          >
                            {isCopiedQuery ? <Check size={13} /> : <Copy size={13} />}
                            <span>{isCopiedQuery ? 'Đã chép' : 'Chép link'}</span>
                          </button>

                          <button
                            type="button"
                            className={`btn-mini-copy btn-pretty ${isCopiedPretty ? 'copied' : ''}`}
                            onClick={(e) => handleCopyLink(guest, 'pretty', e)}
                            title="Sao chép link ngắn dạng /BanLinh"
                          >
                            {isCopiedPretty ? <Check size={13} /> : <Link2 size={13} />}
                            <span>{isCopiedPretty ? 'Link ngắn' : 'Link ngắn'}</span>
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="col-status">
                      {guest.opened ? (
                        <div className="status-badge status-opened">
                          <CheckCircle2 size={15} />
                          <div className="status-text-stack">
                            <span>Đã xem</span>
                            {guest.lastOpenedAt && (
                              <small className="opened-time">{guest.lastOpenedAt}</small>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="status-badge status-unopened">
                          <Clock size={15} />
                          <span>Chưa xem</span>
                        </div>
                      )}
                    </td>
                    <td className="col-count">
                      <span className={`count-pill ${guest.opened ? 'has-views' : ''}`}>
                        {guest.openCount || 0} lượt
                      </span>
                    </td>
                    <td className="col-actions">
                      <div className="actions-cell">
                        <a
                          href={links.queryUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="action-btn btn-view"
                          title="Mở xem thử link này"
                        >
                          <ExternalLink size={15} />
                        </a>
                        <button
                          type="button"
                          className="action-btn btn-delete"
                          onClick={() => handleDeleteGuest(guest.id, guest.name)}
                          title="Xóa link khách mời này"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
