"use client";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Authenticated, Unauthenticated, useMutation } from "convex/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react";
import Header from "../Header";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { api } from "../../../convex/_generated/api";
import { Textarea } from "@/components/ui/textarea";
import { type Id } from "../../../convex/_generated/dataModel";


export default function Upload(){
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [tags, setTags] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const createPost = useMutation(api.posts.createPost);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        if (!file) {
            toast.error("Please select a markdown file to upload.");
            return;
        }
        if (file.type != ".md"){
            toast.error("Please select a markdown (.md) file to upload.");
            return;          
        }
        setIsSubmitting(true);

        try {
            // 1. Get an upload URL
            const uploadUrl = await generateUploadUrl();
            // 2. Upload the file
            const result = await fetch(uploadUrl, {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file,
            });
            const { storageId }: { storageId: string } = await result.json();

            // 3. Create the post with the new storageId
            await createPost({
                title,
                storageId: storageId as Id<"_storage">,
                excerpt,
                tags: tags.split(",").map(tag => tag.trim()).filter(Boolean),
            });

            // Reset form and state
            setTitle("");
            setExcerpt("");
            setTags("");
            setFile(null);
            toast.success("Post created successfully!");
            router.push("/"); // or to the new post page
        } catch (error) {
            console.error("Error creating post:", error);
            toast.error("Failed to create post.", { description: "Check the console for more details."});
        } finally {
            setIsSubmitting(false);
        }
    }

    return(
        <div>
            <Header></Header>
            <div className="flex w-screen h-screen items-center justify-center">
                <Card className="p-4">
                    <Authenticated>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="bg-green-900 text-gray-100">Create New Post</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <form onSubmit={handleSubmit}>
                                    <DialogHeader>
                                        <DialogTitle>Create a new post</DialogTitle>
                                        <DialogDescription>
                                            Fill in the details for your new blog post.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="title">Title</Label>
                                            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="excerpt">Excerpt</Label>
                                            <Textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="tags">Tags (comma-separated)</Label>
                                            <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="content-file">Content (.md file)</Label>
                                            <Input id="content-file" type="file" accept=".md" onChange={(e) => setFile(e.target.files?.[0] ?? null)} required />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                                        <Button type="submit" disabled={isSubmitting}>
                                            {isSubmitting && (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            )}
                                            {isSubmitting ? "Creating..." : "Create Post"}</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>

                    </Authenticated>
                    <Unauthenticated>
                    <SignInButton />
                    <SignUpButton>
                        <Button className="text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                        Sign Up
                        </Button>
                    </SignUpButton>

                    </Unauthenticated>

                </Card>
            </div>

        </div>
    );
}