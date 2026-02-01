import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Building2, MapPin, DollarSign, Users, Briefcase, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';

interface JobFormData {
  title: string;
  company: string;
  location: string;
  type: string;
  salaryMin: string;
  salaryMax: string;
  skills: string;
  description: string;
}

const PostJob = () => {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    company: '',
    location: '',
    type: '',
    salaryMin: '',
    salaryMax: '',
    skills: '',
    description: '',
  });

  const [errors, setErrors] = useState<Partial<JobFormData>>({});

  const validateForm = () => {
    const newErrors: Partial<JobFormData> = {};

    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    if (!formData.company.trim()) newErrors.company = 'Company name is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.type) newErrors.type = 'Job type is required';
    if (!formData.description.trim()) newErrors.description = 'Job description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof JobFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to post a job.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const salary = formData.salaryMin && formData.salaryMax 
        ? `$${formData.salaryMin} - $${formData.salaryMax}` 
        : 'Not specified';

      await apiClient.createJob({
        title: formData.title,
        company: formData.company,
        location: formData.location,
        type: formData.type,
        salary,
        description: formData.description,
        skills: formData.skills
      });

      toast({
        title: "Job Posted Successfully! 🎉",
        description: `Your job posting for ${formData.title} at ${formData.company} is now live and visible to candidates.`,
      });

      // Reset form
      setFormData({
        title: '',
        company: '',
        location: '',
        type: '',
        salaryMin: '',
        salaryMax: '',
        skills: '',
        description: '',
      });
      
      navigate('/jobs');
      
    } catch (error: any) {
      toast({
        title: "Error Posting Job",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const jobTypes = ['Full-time', 'Part-time', 'Remote', 'Internship', 'Contract'];
  const locations = [
    'Remote',
    'New York, NY',
    'San Francisco, CA',
    'London, UK',
    'Seattle, WA',
    'Austin, TX',
    'Boston, MA',
    'Los Angeles, CA',
    'Chicago, IL',
    'Toronto, CA',
  ];

  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold gradient-text mb-4">
              Post a Job Opening
            </h1>
            <p className="text-lg text-muted-foreground">
              Reach thousands of qualified candidates and find your next team member
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <Card className="glass-card border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Job Details
                </CardTitle>
                <CardDescription>
                  Basic information about the position
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g. Senior Frontend Developer"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className={errors.title ? 'border-destructive' : ''}
                    />
                    {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name *</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="company"
                        placeholder="e.g. Acme Inc."
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        className={`pl-10 ${errors.company ? 'border-destructive' : ''}`}
                      />
                    </div>
                    {errors.company && <p className="text-sm text-destructive">{errors.company}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Select value={formData.location} onValueChange={(value) => handleInputChange('location', value)}>
                      <SelectTrigger className={errors.location ? 'border-destructive' : ''}>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <SelectValue placeholder="Select location" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Job Type *</Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                      <SelectTrigger className={errors.type ? 'border-destructive' : ''}>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <SelectValue placeholder="Select job type" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {jobTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Compensation & Skills
                </CardTitle>
                <CardDescription>
                  Salary range and required skills (optional but recommended)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="salaryMin">Minimum Salary (USD)</Label>
                    <Input
                      id="salaryMin"
                      type="number"
                      placeholder="80000"
                      value={formData.salaryMin}
                      onChange={(e) => handleInputChange('salaryMin', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salaryMax">Maximum Salary (USD)</Label>
                    <Input
                      id="salaryMax"
                      type="number"
                      placeholder="120000"
                      value={formData.salaryMax}
                      onChange={(e) => handleInputChange('salaryMax', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills">Required Skills</Label>
                  <Input
                    id="skills"
                    placeholder="React, TypeScript, Node.js, etc. (comma-separated)"
                    value={formData.skills}
                    onChange={(e) => handleInputChange('skills', e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter skills separated by commas
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Job Description
                </CardTitle>
                <CardDescription>
                  Detailed description of the role and responsibilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the role, responsibilities, requirements, and what makes this opportunity special..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className={`min-h-32 ${errors.description ? 'border-destructive' : ''}`}
                  />
                  {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4 justify-end">
              <Button 
                type="button" 
                variant="outline" 
                size="lg"
                onClick={() => {
                  setFormData({
                    title: '',
                    company: '',
                    location: '',
                    type: '',
                    salaryMin: '',
                    salaryMax: '',
                    skills: '',
                    description: '',
                  });
                  setErrors({});
                }}
              >
                Clear Form
              </Button>
              <Button 
                type="submit" 
                variant="hero" 
                size="lg"
                disabled={isSubmitting}
                className="min-w-32"
              >
                {isSubmitting ? 'Posting...' : 'Post Job'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
