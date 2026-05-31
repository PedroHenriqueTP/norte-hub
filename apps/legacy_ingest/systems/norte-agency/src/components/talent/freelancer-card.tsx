"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

interface Freelancer {
    id: string;
    name: string;
    skills: string[];
    rating: number;
    hourlyRate: number | object;
    portfolioUrl?: string | null;
}

export function FreelancerCard({ profile }: { profile: Freelancer }) {
    return (
        <Card className="hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <Avatar className="h-12 w-12">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile.name}`} />
                    <AvatarFallback>{profile.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <CardTitle className="text-base">{profile.name}</CardTitle>
                    <div className="flex items-center text-xs text-muted-foreground">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                        {profile.rating.toFixed(1)}
                        <span className="mx-2">•</span>
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(profile.hourlyRate))}/h
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-1">
                    {profile.skills.map(skill => (
                        <Badge key={skill} variant="secondary" className="text-[10px]">{skill}</Badge>
                    ))}
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full" variant="outline">View Profile & Allocations</Button>
            </CardFooter>
        </Card>
    );
}
