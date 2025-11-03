
"use client";

import {
  FileUp,
  ListVideo,
  Users,
  Download,
  Loader2,
} from "lucide-react";
import * as XLSX from "xlsx";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useFirebase } from "@/firebase";
import { uploadCourseContent, getDashboardStats } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface TopCourse {
  name: string;
  users: number;
}

export default function AdminDashboard() {
  const { user } = useFirebase();
  const { toast } = useToast();
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [stats, setStats] = useState({ userCount: 0, courseCount: 0 });
  const [topCourses, setTopCourses] = useState<TopCourse[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    // Only fetch stats if there is a logged-in user.
    if (user) {
      setStatsLoading(true);
      getDashboardStats()
        .then(result => {
          if (result.success) {
            setStats({
              userCount: result.userCount ?? 0,
              courseCount: result.courseCount ?? 0,
            });
            setTopCourses(result.topCourses ?? []);
          } else {
            toast({
              variant: "destructive",
              title: "Failed to load stats",
              description: result.message,
            });
          }
        })
        .catch(error => {
          toast({
            variant: "destructive",
            title: "Failed to load stats",
            description: error.message || "An unexpected error occurred.",
          });
        })
        .finally(() => {
          setStatsLoading(false);
        });
    } else {
      // If there's no user, don't show loading indefinitely.
      setStatsLoading(false);
    }
  }, [user, toast]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUploadContent = async () => {
    if (selectedFile) {
      setIsUploading(true);
      try {
        const fileBuffer = await selectedFile.arrayBuffer();
        const result = await uploadCourseContent(fileBuffer);
        if (result.success) {
          toast({
            title: "Upload Successful",
            description: result.message,
          });
          // Use router.refresh() to re-run server actions and update data
          router.refresh();
        } else {
          throw new Error(result.message);
        }
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Upload Failed",
          description: error.message || "An unexpected error occurred.",
        });
      } finally {
        setIsUploading(false);
        setSelectedFile(null);
      }
    } else {
      toast({
        variant: "destructive",
        title: "No File Selected",
        description: "Please select an Excel file to upload.",
      });
    }
  };

  const handleDownloadDemo = () => {
    const data = [
      ["Main Topic", "SubTopic", "Youtube Video Link", "Short Description"],
      ["Quantum Physics Explained", "Introduction to Quantum States", "https://www.youtube.com/watch?v=6-rA-v_oW2A", "A brief intro to quantum states."],
      ["Quantum Physics Explained", "Wave-Particle Duality", "https://www.youtube.com/watch?v=M7lc1UVf-VE", "Exploring the dual nature of particles."],
      ["Electronics Fundamentals", "Modulation", "https://www.youtube.com/watch?v=mHvV_Tv8HDQ", "Understanding signal modulation."]
    ];
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "CourseTemplate");
    
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'CourseTemplate.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.userCount}</div>
                <p className="text-xs text-muted-foreground">
                  Registered on the platform
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Courses
                </CardTitle>
                <ListVideo className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.courseCount}</div>
                <p className="text-xs text-muted-foreground">
                  Available for enrollment
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Course Completions</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  Feature coming soon
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Enrollment Rate
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0%</div>
                <p className="text-xs text-muted-foreground">
                  Feature coming soon
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader>
                <CardTitle>User Progress</CardTitle>
                <CardDescription>
                  An overview of user progress across different courses. (Coming Soon)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Progress</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                     <TableRow>
                        <TableCell colSpan={3} className="text-center">
                          User progress tracking is coming soon.
                        </TableCell>
                      </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Content Management</CardTitle>
                <CardDescription>
                  Upload an Excel file to add new courses or update content.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center gap-4 p-6">
                <div className="w-full flex justify-center">
                    <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-600"
                    >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                        <FileUp className="w-10 h-10 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        {selectedFile ? selectedFile.name : <><span className="font-semibold">Click to upload</span> or drag and drop</>}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                        XLSX, XLS (MAX. 5MB)
                        </p>
                    </div>
                    <Input id="file-upload" type="file" className="hidden" accept=".xlsx, .xls" onChange={handleFileUpload} />
                    </label>
                </div>
                <div className="flex w-full flex-col sm:flex-row gap-2 mt-4">
                  <Button className="flex-1" onClick={handleUploadContent} disabled={isUploading}>
                    {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isUploading ? "Uploading..." : "Upload Content"}
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={handleDownloadDemo}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Demo
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Format: "Main Topic", "SubTopic", "Youtube Video Link", "Short Description"
                </p>
              </CardContent>
            </Card>
          </div>
           <Card>
              <CardHeader>
                <CardTitle>Top Courses</CardTitle>
                <CardDescription>
                  Most popular courses by user enrollment.
                </CardDescription>
              </CardHeader>
              <CardContent>
                 {statsLoading ? (
                    <div className="flex justify-center items-center h-[350px]">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={topCourses}>
                        <XAxis
                          dataKey="name"
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                          interval={0}
                        />
                        <YAxis
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `${value}`}
                          allowDecimals={false}
                        />
                        <Bar
                          dataKey="users"
                          fill="currentColor"
                          radius={[4, 4, 0, 0]}
                          className="fill-primary"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
              </CardContent>
            </Card>
        </main>
      </div>
    </div>
  );
}
