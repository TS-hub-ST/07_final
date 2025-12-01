"use client";

import { useState, useEffect } from "react";

export default function Page() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state for creating a movie review
  const [form, setForm] = useState({
    name: "",
    detail: "",
    coverimage: "",
    rating: "",
    release_year: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    async function getMovies() {
      try {
        const apiHost = process.env.NEXT_PUBLIC_API_HOST;
        const res = await fetch(`${apiHost}/movies`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setRows(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    getMovies();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!form.name.trim() || !form.detail.trim()) {
      setFormError("Movie name and detail are required.");
      return;
    }

    try {
      setSubmitting(true);
      const apiHost = process.env.NEXT_PUBLIC_API_HOST;
      const res = await fetch(`${apiHost}/movies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          detail: form.detail.trim(),
          coverimage: form.coverimage.trim() || null,
          rating: form.rating ? Number(form.rating) : null,
          release_year: form.release_year ? Number(form.release_year) : null,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create movie review");
      }

      const created = await res.json();
      // Show the new movie at the top
      setRows((prev) => [created, ...prev]);

      // Reset form
      setForm({
        name: "",
        detail: "",
        coverimage: "",
        rating: "",
        release_year: "",
      });
    } catch (err) {
      setFormError(err.message || "Failed to create movie review.");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ NEW: handle delete
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this review?");
    if (!confirmDelete) return;

    try {
      const apiHost = process.env.NEXT_PUBLIC_API_HOST;
      const res = await fetch(`${apiHost}/movies/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete movie");
      }

      // Remove from UI
      setRows((prev) => prev.filter((movie) => movie.id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete movie.");
    }
  };

  if (loading) {
    return (
      <main className="container">
        <div className="empty">Loading...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container">
        <div className="empty">Error: {error}</div>
      </main>
    );
  }

  return (
    <main className="container">
      {/* Header: Movie Review App name */}
      <header className="header">
        <h1 className="title">Movie Review App</h1>
        <p className="subtitle">
          Add your review and explore movies in one simple table.
        </p>
      </header>

      {/* Add Review Box */}
      <section className="create-box">
        <h2 className="section-title">Add a New Movie Review</h2>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label className="label">
              Movie Name
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="input"
                placeholder="Enter movie name"
                required
              />
            </label>
          </div>

          <div className="form-row">
            <label className="label">
              Detail
              <textarea
                name="detail"
                value={form.detail}
                onChange={handleChange}
                className="textarea"
                placeholder="Write a short review"
                required
              />
            </label>
          </div>

          <div className="form-row">
            <label className="label">
              Cover Image URL
              <input
                type="text"
                name="coverimage"
                value={form.coverimage}
                onChange={handleChange}
                className="input"
                placeholder="https://example.com/poster.jpg"
              />
            </label>
          </div>

          <div className="form-row form-row-inline">
            <label className="label">
              Rating
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                name="rating"
                value={form.rating}
                onChange={handleChange}
                className="input"
                placeholder="e.g. 8.5"
              />
            </label>

            <label className="label">
              Release Year
              <input
                type="number"
                name="release_year"
                value={form.release_year}
                onChange={handleChange}
                className="input"
                placeholder="e.g. 2019"
              />
            </label>
          </div>

          {formError && <p className="form-error">{formError}</p>}

          <button type="submit" className="button button-primary" disabled={submitting}>
            {submitting ? "Creating..." : "Create"}
          </button>
        </form>
      </section>

      {/* Movie Table */}
      <section className="table-section" aria-live="polite">
        {(!rows || rows.length === 0) ? (
          <div className="empty">No movies found.</div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Cover</th>
                  <th>Name</th>
                  <th>Detail</th>
                  <th>Rating</th>
                  <th>Release Year</th>
                  {/* ✅ NEW: Actions column */}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((movie) => (
                  <tr key={movie.id}>
                    <td>
                      {movie.coverimage ? (
                        <img
                          src={movie.coverimage}
                          alt={movie.name}
                          className="table-img"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <span className="muted">No image</span>
                      )}
                    </td>
                    <td>{movie.name}</td>
                    <td>{movie.detail}</td>
                    <td>{movie.rating}</td>
                    <td>{movie.release_year}</td>
                    {/* ✅ NEW: Delete button */}
                    <td>
                      <button
                        type="button"
                        className="button button-danger"
                        onClick={() => handleDelete(movie.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
