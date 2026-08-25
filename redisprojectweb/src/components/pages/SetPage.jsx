import { useState } from 'react';
import { TbCirclesRelation } from 'react-icons/tb';
import { setApi } from '../../api/redisApi';
import InputField from '../common/InputField';
import ActionButton from '../common/ActionButton';
import ResultDisplay from '../common/ResultDisplay';
import CommandLog from '../common/CommandLog';
import TheorySection from '../common/TheorySection';

function SetPage() {
  const [key, setKey] = useState('myset');
  const [value, setValue] = useState('');
  const [members, setMembers] = useState([]);
  const [isMemberResult, setIsMemberResult] = useState(null);
  const [checkValue, setCheckValue] = useState('');
  const [commands, setCommands] = useState([]);
  const [error, setError] = useState(null);

  const addCommand = (data) => {
    setCommands((prev) => [...prev, data]);
    setError(null);
  };

  const handleError = (err) => {
    const msg = err.response?.data?.result || err.message;
    setError(msg);
  };

  const refreshMembers = async () => {
    try {
      const res = await setApi.members(key);
      addCommand(res.data);
      const result = res.data.result;
      if (Array.isArray(result)) {
        setMembers(result);
      } else {
        setMembers([]);
      }
    } catch (err) {
      handleError(err);
    }
  };

  const handleAdd = async () => {
    if (!value.trim()) return;
    try {
      const res = await setApi.add(key, value);
      addCommand(res.data);
      setValue('');
      await refreshMembers();
    } catch (err) {
      handleError(err);
    }
  };

  const handleRemove = async () => {
    if (!value.trim()) return;
    try {
      const res = await setApi.remove(key, value);
      addCommand(res.data);
      setValue('');
      await refreshMembers();
    } catch (err) {
      handleError(err);
    }
  };

  const handleMembers = async () => {
    await refreshMembers();
  };

  const handleIsMember = async () => {
    if (!checkValue.trim()) return;
    try {
      const res = await setApi.isMember(key, checkValue);
      addCommand(res.data);
      setIsMemberResult(res.data.result);
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">
          <TbCirclesRelation className="icon" />
          Sets
        </h1>
      </div>

      <TheorySection title="Redis Sets - Temel Kavramlar">
        <p>
          Set, <strong>benzersiz (unique)</strong> elemanlardan oluşan sırasız bir koleksiyondur. Aynı eleman iki kez eklenemez.
          Eleman varlık kontrolü çok hızlıdır. Birleşim, kesişim ve fark gibi küme işlemlerini destekler.
          Benzersiz ziyaretçi takibi, etiket sistemi, online kullanıcılar ve ortak arkadaş bulma gibi
          senaryolarda kullanılır.
        </p>
        <h4>Performans Özellikleri</h4>
        <ul>
          <li><strong>O(1)</strong> ekleme, silme ve üyelik kontrolü (<code>SISMEMBER</code>)</li>
          <li>Küme operasyonları: birleşim, kesişim ve fark işlemleri desteklenir</li>
        </ul>

        <h4>Gerçek Hayat Örnekleri</h4>
        <div className="feature-grid" style={{ marginBottom: 16 }}>
          <div className="feature-card">
            <div className="feature-icon" style={{ fontSize: '1.6rem' }}>🏷️</div>
            <div className="feature-title">Tag Sistemi</div>
            <div className="feature-desc">Blog yazısına <code>SADD post:5001:tags &quot;redis&quot; &quot;nosql&quot; &quot;cache&quot;</code> ile etiket ekle. Aynı etiket iki kez eklenemez.</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ fontSize: '1.6rem' }}>👁️</div>
            <div className="feature-title">Benzersiz Ziyaretçi</div>
            <div className="feature-desc">Her ziyarette <code>SADD visitors:2025-07-02 &quot;user:1001&quot;</code>. Aynı kullanıcı tekrar gelse bile sayılmaz. <code>SCARD</code> ile günlük tekil ziyaretçi sayısını öğren.</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ fontSize: '1.6rem' }}>🤝</div>
            <div className="feature-title">Ortak Arkadaşlar</div>
            <div className="feature-desc">LinkedIn/Facebook gibi — <code>SINTER user:alice:friends user:bob:friends</code> ile ortak arkadaşları bul. <code>SDIFF</code> ile &quot;senin tanımadığın arkadaşları&quot; öner.</div>
          </div>
        </div>
        <div className="tip-box">
          <strong>İpucu:</strong> SISMEMBER ile üyelik kontrolü O(1) olduğu için, &quot;bu kullanıcı daha önce bu işlemi yaptı mı?&quot; gibi kontroller için idealdir.
        </div>
      </TheorySection>

      <div className="two-columns" style={{ marginBottom: 16 }}>
        <div className="card">
          <div className="card-title">
            <TbCirclesRelation className="icon" />
            Set Operations
          </div>

          <div className="form-row">
            <InputField label="Key" value={key} onChange={setKey} placeholder="Set key" />
            <InputField label="Value" value={value} onChange={setValue} placeholder="Member value" />
          </div>

          <div className="button-group" style={{ marginBottom: 16 }}>
            <ActionButton variant="primary" onClick={handleAdd}>SADD</ActionButton>
            <ActionButton variant="danger" onClick={handleRemove}>SREM</ActionButton>
            <ActionButton variant="info" onClick={handleMembers}>SMEMBERS</ActionButton>
          </div>

          <div className="form-row">
            <InputField label="Check Member" value={checkValue} onChange={setCheckValue} placeholder="Value to check" />
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <ActionButton variant="success" onClick={handleIsMember}>SISMEMBER</ActionButton>
            </div>
          </div>

          {isMemberResult !== null && (
            <div className="result-display fade-in">
              <div className="result-display-title">Is Member?</div>
              <span className={`result-display-value ${isMemberResult === true || isMemberResult === 1 || isMemberResult === '1' || isMemberResult === 'true' ? 'status-hit' : 'status-miss'}`}>
                {isMemberResult === true || isMemberResult === 1 || isMemberResult === '1' || isMemberResult === 'true' ? 'YES - Member exists' : 'NO - Not a member'}
              </span>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="card">
          <div className="card-title">Members</div>
          {members.length === 0 ? (
            <div className="empty-state">No members. Add some values to the set.</div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {members.map((member, index) => (
                <span key={index} className="chip">
                  {String(member)}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <CommandLog commands={commands} onClear={() => setCommands([])} />

      {/* Soru-Cevap */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-title">Soru & Cevap</div>
        <details style={{ marginBottom: 12 }}>
          <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
            Bir online oyunda şu anda kaç kişinin oynadığını saymak istiyorsun. Aynı kişi tekrar giriş yaparsa sayı artar mı?
          </summary>
          <div style={{ marginTop: 8, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.7, padding: '8px 12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
            Set kullanırsan artmaz. Çünkü Set aynı elemanı ikinci kez eklemeye izin vermez — kullanıcı 5 kez giriş yapsa bile
            Set&apos;te sadece 1 kez yer alır. Bu sayede &quot;şu anda 1.250 kişi oynuyor&quot; bilgisi her zaman doğru olur.
            Liste kullansaydın aynı kişi her girişte tekrar eklenir ve sayı şişerdi.
          </div>
        </details>
        <details>
          <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
            Bir kullanıcı aynı ürüne birden fazla kez &quot;beğen&quot; butonuna basarsa ne olmalı? Set bu sorunu nasıl çözer?
          </summary>
          <div style={{ marginTop: 8, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.7, padding: '8px 12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
            Aynı kullanıcı bir ürünü 10 kez beğense bile beğeni sayısı 1 olmalıdır — aksi halde beğeni sayıları anlamsızlaşır.
            Set yapısı bunu otomatik olarak sağlar: aynı elemanı tekrar eklemeye çalıştığında sessizce reddeder.
            Böylece uygulamanın &quot;bu kullanıcı daha önce beğenmiş mi?&quot; diye ayrıca kontrol etmesine gerek kalmaz — Set bunu garanti eder.
          </div>
        </details>
      </div>
    </div>
  );
}

export default SetPage;
