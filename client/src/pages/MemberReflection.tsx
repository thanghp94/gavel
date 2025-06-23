
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Send, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MemberReflection = () => {
  const { meetingId } = useParams();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Reflection Submitted",
        description: "Thank you for sharing your thoughts! Your reflection has been recorded.",
      });
      
      // Redirect back to member dashboard
      window.location.href = '/member/dashboard';
    }, 2000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <div className="w-12 h-12 mx-auto mb-4 bg-white/20 rounded-lg flex items-center justify-center">
              <MessageSquare className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold">
              YOUR PERSONAL CLASS REFLECTION
            </CardTitle>
            <CardTitle className="text-lg font-medium mt-2">
              NHÌN LẠI CUỐI BUỔI SINH HOẠT
            </CardTitle>
            <CardDescription className="text-blue-100 mt-4 max-w-2xl mx-auto">
              Thank you for attending today's meeting! Your feedback helps us improve our club and your personal development journey. 
              Please take a few minutes to reflect on your experience.
            </CardDescription>
            <CardDescription className="text-blue-100 mt-2 max-w-2xl mx-auto">
              Cảm ơn bạn đã tham gia buổi sinh hoạt hôm nay! Phản hồi của bạn giúp chúng tôi cải thiện câu lạc bộ và hành trình phát triển cá nhân của bạn.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Question 1 - Name */}
              <div className="space-y-3">
                <Label htmlFor="name" className="text-lg font-semibold text-gray-900">
                  1. Tên của bạn là gì? (What is your name?)
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name / Nhập tên đầy đủ của bạn"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="text-base"
                  required
                />
              </div>

              {/* Question 2 - Feelings */}
              <div className="space-y-3">
                <Label className="text-lg font-semibold text-gray-900">
                  2. Hôm nay bạn cảm thấy thế nào sau buổi học? Và vì sao?
                </Label>
                <p className="text-sm text-gray-600">
                  (How do you feel today after class? And why?)
                </p>
                <Textarea
                  placeholder="Share your feelings and thoughts about today's session..."
                  value={formData.q1}
                  onChange={(e) => handleInputChange('q1', e.target.value)}
                  className="min-h-[120px] text-base"
                  required
                />
              </div>

              {/* Question 3 - Confidence */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold text-gray-900">
                  3. Lớp học có giúp bạn tự tin hơn khi nói trước đám đông không?
                </Label>
                <p className="text-sm text-gray-600">
                  (Did the class help you feel more confident when speaking in front of a crowd?)
                </p>
                <RadioGroup 
                  value={formData.q2} 
                  onValueChange={(value) => handleInputChange('q2', value)}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="yes_a_lot" id="yes_a_lot" />
                    <Label htmlFor="yes_a_lot" className="flex-1 cursor-pointer">
                      Có, tôi cảm thấy tự tin hơn rất nhiều (Yes, I feel much more confident)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="yes_a_bit" id="yes_a_bit" />
                    <Label htmlFor="yes_a_bit" className="flex-1 cursor-pointer">
                      Có, tôi cảm thấy tự tin hơn một chút (Yes, I feel a bit more confident)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="no_didnt_see_it" id="no_didnt_see_it" />
                    <Label htmlFor="no_didnt_see_it" className="flex-1 cursor-pointer">
                      Không, tôi không thấy sự khác biệ t (No, I didn't see the difference)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Question 4 - What you liked most */}
              <div className="space-y-3">
                <Label className="text-lg font-semibold text-gray-900">
                  4. Bạn thích nhất điều gì ở buổi sinh hoạt hôm nay?
                </Label>
                <p className="text-sm text-gray-600">
                  (What did you like most about today's session?)
                </p>
                <Textarea
                  placeholder="Tell us what you enjoyed the most about today's meeting..."
                  value={formData.q3}
                  onChange={(e) => handleInputChange('q3', e.target.value)}
                  className="min-h-[120px] text-base"
                  required
                />
              </div>

              {/* Question 5 - Difficulties */}
              <div className="space-y-3">
                <Label className="text-lg font-semibold text-gray-900">
                  5. Bạn có gặp khó khăn gì trong buổi sinh hoạt hôm nay không? Nếu có...?
                </Label>
                <p className="text-sm text-gray-600">
                  (Was there anything difficult when you took this session? If any what is it?)
                </p>
                <Textarea
                  placeholder="Share any challenges or difficulties you experienced..."
                  value={formData.q4}
                  onChange={(e) => handleInputChange('q4', e.target.value)}
                  className="min-h-[120px] text-base"
                />
              </div>

              {/* Question 6 - How can we help */}
              <div className="space-y-3">
                <Label className="text-lg font-semibold text-gray-900">
                  6. Bạn muốn tụi mình giúp gì để bạn học tốt hơn?
                </Label>
                <p className="text-sm text-gray-600">
                  (What do you want us to do to help you study better?)
                </p>
                <Textarea
                  placeholder="Let us know how we can better support your learning journey..."
                  value={formData.q5}
                  onChange={(e) => handleInputChange('q5', e.target.value)}
                  className="min-h-[120px] text-base"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="pt-6 text-center">
                <Button 
                  type="submit" 
                  size="lg"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8"
                >
                  {isSubmitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Reflection
                    </>
                  )}
                </Button>
                <p className="text-sm text-gray-500 mt-4">
                  Meeting ID: {meetingId} • Your response will be kept confidential
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MemberReflection;
