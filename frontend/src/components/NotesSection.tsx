import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../utils/api";
import { Note } from "../types";

interface NotesSectionProps {
    customerId?: string;
    leadId?: string;
    currentUserId?: string;
}

const NotesSection: React.FC<NotesSectionProps> = ({ customerId, leadId, currentUserId }) => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [content, setContent] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const fetchNotes = async () => {
        try {
            const queryParam = customerId ? `customerId=${customerId}` : `leadId=${leadId}`;
            const res = await axios.get(`${API_BASE_URL}/notes?${queryParam}`);
            setNotes(res.data);
        } catch (err) {
            console.error("Failed to load notes:", err);
        }
    };

    useEffect(() => {
        if (customerId || leadId) {
            fetchNotes();
        }
    }, [customerId, leadId]);

    const handleAddNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE_URL}/notes`, {
                content,
                customerId,
                leadId,
            });
            setNotes((prev) => [res.data, ...prev]);
            setContent("");
        } catch (err: any) {
            window.alert(err.response?.data?.message || "Failed to add note.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteNote = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this note?")) return;
        try {
            await axios.delete(`${API_BASE_URL}/notes/${id}`);
            setNotes((prev) => prev.filter((note) => note._id !== id));
        } catch (err: any) {
            window.alert(err.response?.data?.message || "Failed to delete note.");
        }
    };

    return (
        <div className="mt-6 border-t pt-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Notes & Activity</h4>

            <form onSubmit={handleAddNote} className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Add a new note..."
                    className="flex-1 p-2 rounded-lg border border-gray-300 bg-gray-50 text-sm"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-violet-700 hover:bg-violet-800 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                    {loading ? "Adding..." : "Add"}
                </button>
            </form>

            <div className="space-y-2 max-h-48 overflow-y-auto">
                {notes.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">No notes added yet.</p>
                ) : (
                    notes.map((note) => (
                        <div
                            key={note._id}
                            className="p-3 bg-gray-50 border rounded-lg flex justify-between items-start text-sm"
                        >
                            <div>
                                <p className="text-gray-800">{note.content}</p>
                                <span className="text-xs text-gray-400">
                                    By {note.createdById?.name || "User"} • {new Date(note.createdAt).toLocaleString()}
                                </span>
                            </div>
                            {currentUserId === note.createdById?._id && (
                                <button
                                    type="button"
                                    onClick={() => handleDeleteNote(note._id)}
                                    className="text-xs text-red-600 hover:text-red-800 ml-2"
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotesSection;