import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CompanyCarousel from '@/components/CompanyCarousel';
import FAQ from '@/components/FAQ';
import { Search, Users, Building2, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                1000+ new jobs added this week
              </span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              Find Your{' '}
              <span className="gradient-text">Dream Job</span>
              <br />
              With Hireable
            </h1>
            
            <p className="text-xl lg:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Connect with top companies and discover opportunities that match your skills, 
              ambitions, and lifestyle. Your next career move starts here.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button variant="hero" size="xl" asChild className="min-w-48">
                <Link to="/jobs">
                  <Search className="w-5 h-5 mr-2" />
                  Explore Jobs
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild className="min-w-48">
                <Link to="/post-job">
                  <Building2 className="w-5 h-5 mr-2" />
                  Post a Job
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Company Carousel */}
      <section className="py-12 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <CompanyCarousel />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold gradient-text mb-4">
              Why Choose Hireable?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We've built the modern job portal that works for everyone
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass-card p-8 text-center hover-lift group">
              <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Smart Job Search</h3>
              <p className="text-muted-foreground">
                Advanced filters and AI-powered recommendations help you find the perfect role quickly.
              </p>
            </div>

            <div className="glass-card p-8 text-center hover-lift group">
              <div className="w-16 h-16 gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Top Companies</h3>
              <p className="text-muted-foreground">
                Access exclusive opportunities from Fortune 500 companies and innovative startups.
              </p>
            </div>

            <div className="glass-card p-8 text-center hover-lift group">
              <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Career Growth</h3>
              <p className="text-muted-foreground">
                Find roles that accelerate your career with competitive salaries and benefits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-12 text-center max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Take the Next Step?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have found their dream jobs through our platform. 
              Your perfect opportunity is just one click away.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/jobs">
                  Start Job Search
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/post-job">
                  Hire Top Talent
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />
    </div>
  );
};

export default Home;