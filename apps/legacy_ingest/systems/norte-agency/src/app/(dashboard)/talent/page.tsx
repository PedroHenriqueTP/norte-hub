import { getFreelancers } from "@/actions/talent";
import { getActiveJobsPlain } from "@/actions/allocation";
import { FreelancerCard } from "@/components/talent/freelancer-card"; // Logic moved here or we pass props
// Actually, to keep FreelancerCard pure or not? 
// Let's modify FreelancerCard to accept 'jobs' prop or a slot.
// Easier: Just modify page to pass jobs to a wrapper or modified card.

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// For this MVP, I'll pass the jobs list to the card so it can render the dialog.
import { AllocDialog } from "@/components/talent/alloc-dialog";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

// Redefine FreelancerCard locally or import if I update the component file.
// I will update the component file in the next step, for now defining inline purely for 'page' or updating 'component'.
// Let's update the component file instead of inline.

export default async function TalentPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const resolvedSearchParams = await searchParams;
    const query = resolvedSearchParams?.q || "";
    const freelancers = await getFreelancers(query);
    const jobs = await getActiveJobsPlain();

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Talent Marketplace</h1>
                    <p className="text-muted-foreground">Find and book the best freelancers for your jobs.</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <form action="" className="flex gap-2 w-full">
                        <Input name="q" placeholder="Search by name or skill..." defaultValue={query} className="w-full md:w-64" />
                        <Button type="submit" size="icon" variant="secondary"><Search className="h-4 w-4" /></Button>
                    </form>
                </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {freelancers.length > 0 ? (
                    freelancers.map(f => (
                        <Card key={f.id} className="hover:border-primary/50 transition-colors flex flex-col">
                            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${f.name}`} />
                                    <AvatarFallback>{f.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <CardTitle className="text-base">{f.name}</CardTitle>
                                    <div className="flex items-center text-xs text-muted-foreground">
                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                                        {f.rating?.toFixed(1) || 5.0}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3 flex-1">
                                <div className="flex flex-wrap gap-1">
                                    {f.skills.map((skill: string) => (
                                        <Badge key={skill} variant="secondary" className="text-[10px]">{skill}</Badge>
                                    ))}
                                </div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(f.hourlyRate))}/h
                                </p>
                            </CardContent>
                            <CardFooter>
                                <AllocDialog freelancerId={f.id} freelancerName={f.name} jobs={jobs} />
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">No freelancers found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
