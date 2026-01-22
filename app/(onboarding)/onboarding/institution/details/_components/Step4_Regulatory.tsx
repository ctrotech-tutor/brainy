"use client";

import { useFormContext } from "react-hook-form";
import { FullInstitutionInput } from "../_hooks/useInstitutionForm";
import { ShieldCheck, Hash, Users, GraduationCap } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Step4_Regulatory = () => {
    const { control } = useFormContext<FullInstitutionInput>();

    return (
        <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                    control={control}
                    name="nucCode"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                                <ShieldCheck className="h-3 w-3" />
                                NUC Code / NBTE Code
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Regulatory Identifier"
                                    className="h-12 px-5 rounded-xl bg-white/5 border-white/5 focus-visible:ring-primary/20 transition-all font-bold placeholder:font-medium"
                                />
                            </FormControl>
                            <FormMessage className="text-[10px] font-bold" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="accreditationNumber"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                                <Hash className="h-3 w-3" />
                                Accreditation No.
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="AC-RR-..."
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
                name="studentPopulation"
                render={({ field }) => (
                    <FormItem className="space-y-2">
                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                            <Users className="h-3 w-3" />
                            Student Population Grid
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger className="h-12 rounded-xl bg-white/5 border-white/5 focus:ring-primary/20 backdrop-blur-md transition-all">
                                    <SelectValue placeholder="Select Demographic Scale" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-black/90 backdrop-blur-xl border-white/10">
                                <SelectItem value="LESS_THAN_1000">Less than 1,000</SelectItem>
                                <SelectItem value="1000-5000">1,000 - 5,000</SelectItem>
                                <SelectItem value="5000-10000">5,000 - 10,000</SelectItem>
                                <SelectItem value="10000-20000">10,000 - 20,000</SelectItem>
                                <SelectItem value="20000-50000">20,000 - 50,000</SelectItem>
                                <SelectItem value="MORE_THAN_50000">More than 50,000</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage className="text-[10px] font-bold" />
                    </FormItem>
                )}
            />
        </div>
    );
};
