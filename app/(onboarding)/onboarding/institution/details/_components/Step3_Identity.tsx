"use client";

import { useFormContext } from "react-hook-form";
import { FullInstitutionInput } from "../_hooks/useInstitutionForm";
import { Sparkles, Quote, AlignLeft, Target, Eye } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Step3_Identity = () => {
    const { control } = useFormContext<FullInstitutionInput>();

    return (
        <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                    control={control}
                    name="shortName"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                                <Sparkles className="h-3 w-3" />
                                Acronym / Alias
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="e.g. UNILAG, UI"
                                    className="h-12 px-5 rounded-xl bg-white/5 border-white/5 focus-visible:ring-primary/20 transition-all font-bold placeholder:font-medium"
                                />
                            </FormControl>
                            <FormMessage className="text-[10px] font-bold" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="motto"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                                <Quote className="h-3 w-3" />
                                Institutional Motto
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="e.g. In Deed and in Truth"
                                    className="h-12 px-5 rounded-xl bg-white/5 border-white/5 focus-visible:ring-primary/20 transition-all font-bold placeholder:font-medium"
                                />
                            </FormControl>
                            <FormMessage className="text-[10px] font-bold" />
                        </FormItem>
                    )}
                />
            </div>

            <FormField
                control={control}
                name="description"
                render={({ field }) => (
                    <FormItem className="space-y-2">
                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                            <AlignLeft className="h-3 w-3" />
                            Entity Abstract (Description)
                        </FormLabel>
                        <FormControl>
                            <Textarea
                                {...field}
                                placeholder="Briefly describe the institution..."
                                className="min-h-[100px] px-5 py-4 rounded-xl bg-white/5 border-white/5 focus-visible:ring-primary/20 transition-all font-medium placeholder:font-medium resize-none"
                            />
                        </FormControl>
                        <FormMessage className="text-[10px] font-bold" />
                    </FormItem>
                )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                    control={control}
                    name="mission"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                                <Target className="h-3 w-3" />
                                Mission Statement
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    placeholder="Our mission is to..."
                                    className="min-h-[80px] px-5 py-4 rounded-xl bg-white/5 border-white/5 focus-visible:ring-primary/20 transition-all font-medium placeholder:font-medium resize-none text-[13px]"
                                />
                            </FormControl>
                            <FormMessage className="text-[10px] font-bold" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="vision"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                                <Eye className="h-3 w-3" />
                                Vision Statement
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    placeholder="To become the leading..."
                                    className="min-h-[80px] px-5 py-4 rounded-xl bg-white/5 border-white/5 focus-visible:ring-primary/20 transition-all font-medium placeholder:font-medium resize-none text-[13px]"
                                />
                            </FormControl>
                            <FormMessage className="text-[10px] font-bold" />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
};
