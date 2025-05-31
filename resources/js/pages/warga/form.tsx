import { Head, useForm } from '@inertiajs/react';
import { PageProps } from '@inertiajs/core';


export default function Form({ data, status, role }: PageProps & { data: any, status: string, role: string }) {
  const { data: form, setData, post, processing, errors } = useForm({
    nama: data?.nama || '',
    nik: data?.nik || '',
    no_rumah: data?.no_rumah || '',
    no_hp: data?.no_hp || '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('warga.submit'));
  };

  return (
    <>
      <Head title="Form">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css"></link>
      </Head>

      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="card shadow-sm" style={{ width: '100%', maxWidth: '500px' }}>
          <div className="card-body">
            {role === 'pending' && status === 'waiting' && (
              <div className="alert alert-warning" role="alert">
              <i className="bi bi-exclamation-triangle-fill"></i> Silakan isi data diri, dan tunggu diverifikasi admin.
              </div>
            )}

            {role === 'pending' ? (
              <form onSubmit={submit}>
                {(['nama', 'nik', 'no_rumah', 'no_hp'] as const).map((key) => (
                  <div className="mb-3" key={key}>
                    <label className="form-label text-capitalize">{key.replace('_', ' ')}</label>
                    <input
                      type="text"
                      value={form[key]}
                      onChange={(e) => setData(key, e.target.value)}
                      className="form-control"
                    />
                    {errors[key] && <div className="text-danger mt-1">{errors[key]}</div>}
                  </div>
                ))}

                <button type="submit" className="btn btn-primary w-100">
                  {status === 'waiting' ? 'Kirim Ulang' : 'Kirim'}
                </button>
              </form>
            ) : role === 'warga' ? (
              <div className="alert alert-info">
                Anda sudah mengisi formulir warga dengan data berikut:
                <ul className="mt-2">
                  <li><strong>Nama:</strong> {form.nama}</li>
                  <li><strong>NIK:</strong> {form.nik}</li>
                  <li><strong>No. Rumah:</strong> {form.no_rumah}</li>
                  <li><strong>No. HP:</strong> {form.no_hp}</li>
                </ul>
                Silakan tunggu approval dari Ketua RT.
              </div>
            ) : null}

          </div>
        </div>
      </div>

    </>
  );
}
