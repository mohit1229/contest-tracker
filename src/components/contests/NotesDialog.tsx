"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { StickyNote, Trash2 } from "lucide-react"

interface NotesDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  initialNote: string | null
  onSave: (note: string) => void
  onDelete: () => void
  contestTitle: string
}

const MAX_LINES = 100;
const MAX_CHARS = 2000; // Reasonable limit for 100 lines

export function NotesDialog({
  isOpen,
  onOpenChange,
  initialNote,
  onSave,
  onDelete,
  contestTitle,
}: NotesDialogProps) {
  const [note, setNote] = useState(initialNote || "")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setNote(initialNote || "")
    setError(null)
  }, [initialNote, isOpen])

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNote = e.target.value
    const lines = newNote.split('\n')
    
    if (lines.length > MAX_LINES) {
      setError(`Notes cannot exceed ${MAX_LINES} lines`)
      return
    }
    
    if (newNote.length > MAX_CHARS) {
      setError(`Notes cannot exceed ${MAX_CHARS} characters`)
      return
    }
    
    setNote(newNote)
    setError(null)
  }

  const handleSave = () => {
    if (!error) {
      onSave(note)
      onOpenChange(false)
    }
  }

  const handleDelete = () => {
    onDelete()
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <StickyNote className="w-5 h-5" />
            Notes for {contestTitle}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Textarea
              placeholder="Write your notes here..."
              value={note}
              onChange={handleNoteChange}
              className="min-h-[150px] max-h-[400px] resize-y"
              maxLength={MAX_CHARS}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                {note.split('\n').length} / {MAX_LINES} lines
              </span>
              <span>
                {note.length} / {MAX_CHARS} characters
              </span>
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>
        </div>
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button 
            variant="destructive" 
            size="sm"
            onClick={handleDelete}
            className="mr-auto"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete Note
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!!error}>
              Save Notes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 