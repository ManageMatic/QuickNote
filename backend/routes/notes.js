const express = require('express')
const router = express.Router()
const fetchUser = require('../middleware/fetchUser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');

// Route 1: Fetch all notes using: GET "api/notes/fetchallnotes". logged in user required
router.get('/fetchallnotes', fetchUser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id })
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// Route 2: Add a new note using: POST "api/notes/addnote". logged in user required
router.post('/addnote', fetchUser, async (req, res) => {
    const { title, description, tag, reminder } = req.body;
    try {
        const note = new Notes({
            title, description, tag, reminder, user: req.user.id
        })
        const savedNote = await note.save()
        res.json(savedNote)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// Route 3: Update an existing note using: PUT "api/notes/updatenote". logged in user required
router.put('/updatenote/:id', fetchUser, async (req, res) => {
    const { title, description, tag } = req.body;
    // Create a new note object
    const newNote = {};
    if (title) { newNote.title = title }
    if (description) { newNote.description = description }
    if (tag) { newNote.tag = tag }

    // Find the note to be updated and update it
    try {
        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        // Allow update only if the user owns the note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json(note);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// Route 4: Delete an existing note using: DELETE "api/notes/deletenote". logged in user required
router.delete('/deletenote/:id', fetchUser, async (req, res) => {
    // Find the note to be deleted and delete it
    try {
        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        // Allow deletion only if the user owns the note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Note has been deleted", note: note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// Route 5: Toggle pin status of a note using: PUT "api/notes/togglepin/:id". logged in user required
router.put('/togglepin/:id', fetchUser, async (req, res) => {
    try {
        let note = await Notes.findById(req.params.id);  // use let here
        if (!note) return res.status(404).send("Not Found");

        if (note.user.toString() !== req.user.id)
            return res.status(401).send("Not Allowed");

        note.pinned = !note.pinned;
        await note.save();

        res.json({ success: true, pinned: note.pinned });
    } catch (error) {
        console.error("Toggle Pin Error:", error.message);
        res.status(500).send("Internal Server Error");
    }
});


// Route 6: Toggle favorite status of a note using: PUT "api/notes/togglefavorite/:id". logged in user required
router.put('/togglefavorite/:id', fetchUser, async (req, res) => {
    try {
        let note = await Notes.findById(req.params.id);
        if (!note) return res.status(404).send("Not Found");

        if (note.user.toString() !== req.user.id)
            return res.status(401).send("Not Allowed");

        note.favorite = !note.favorite;
        await note.save();

        res.json({ success: true, favorite: note.favorite });
    } catch (error) {
        console.error("Toggle Favorite Error:", error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Route 7: Move notes in the trash using: PUT "/api/notes/trash/:id". logged in user required
router.put('/trash/:id', fetchUser, async (req, res) => {
    try {
        const note = await Notes.findById(req.params.id);
        if (!note) return res.status(404).send("Not Found");
        if (note.user.toString() !== req.user.id) return res.status(401).send("Not Allowed");

        note.trashed = true;
        await note.save();

        res.json({ success: true, message: "Note moved to trash." });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Route 8: Restore notes from trash using: PUT "/api/notes/restore/:id". logged in user required
router.put('/restore/:id', fetchUser, async (req, res) => {
    try {
        const note = await Notes.findById(req.params.id);
        if (!note) return res.status(404).send("Not Found");

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note.trashed = false;
        await note.save();

        res.json({ success: true, message: "Note restored" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
    }
});

// Route 9: Fetch only trashed notes using: GET "/api/notes/trash". logged in user required
router.get('/trash', fetchUser, async (req, res) => {
    try {
        const trashedNotes = await Notes.find({ user: req.user.id, trashed: true });
        res.json(trashedNotes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router