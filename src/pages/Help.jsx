import { Link } from 'react-router-dom';
import { ArrowLeft, Brain, TrendingDown, RefreshCw, Target, HelpCircle, FileText, Code } from 'lucide-react';

export default function Help() {
    return (
        <div className="animate-fade-in max-w-4xl mx-auto">
            <header className="flex items-center gap-4 mb-6">
                <Link to="/" className="btn btn-secondary">
                    <ArrowLeft size={18} />
                    Back
                </Link>
                <h1>Help & Learning Science</h1>
            </header>

            <div className="space-y-6">
                {/* Purpose Section */}
                <div className="card">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-accent/10 rounded-lg">
                            <Brain size={24} className="text-accent" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl mb-3">What is Memora?</h2>
                            <p className="text-secondary leading-relaxed mb-3">
                                Memora is a flashcard application designed to help you learn and retain information more effectively
                                using scientifically-proven spaced repetition techniques. Unlike traditional study methods, Memora
                                optimizes when you review each card to maximize long-term memory retention.
                            </p>
                            <p className="text-secondary leading-relaxed">
                                Whether you're learning a new language, studying for exams, or mastering any subject, Memora helps
                                you remember more by reviewing less—focusing your time on what you're about to forget.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Forgetting Curve Section */}
                <div className="card">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-accent/10 rounded-lg">
                            <TrendingDown size={24} className="text-accent" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl mb-3">The Forgetting Curve</h2>
                            <p className="text-secondary leading-relaxed mb-3">
                                In 1885, psychologist Hermann Ebbinghaus discovered the "forgetting curve"—a pattern that shows
                                how quickly we forget new information. His research revealed that:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-secondary ml-4 mb-3">
                                <li>Within 20 minutes, we forget about 40% of new information</li>
                                <li>After 1 day, we retain only about 30% of what we learned</li>
                                <li>By day 7, retention drops to roughly 10% without review</li>
                            </ul>
                            <p className="text-secondary leading-relaxed">
                                This rapid decline in memory happens because our brains naturally filter out information
                                that doesn't seem important. The good news? Strategic review at the right times can dramatically
                                slow this forgetting process.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Spaced Repetition Section */}
                <div className="card">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-accent/10 rounded-lg">
                            <RefreshCw size={24} className="text-accent" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl mb-3">How Spaced Repetition Works</h2>
                            <p className="text-secondary leading-relaxed mb-3">
                                Spaced repetition is a learning technique that fights the forgetting curve by reviewing
                                information at increasingly longer intervals. Here's how Memora implements it:
                            </p>
                            <div className="space-y-3 mb-3">
                                <div className="p-4 bg-card-hover rounded-lg">
                                    <h3 className="text-lg font-semibold mb-2">Initial Learning</h3>
                                    <p className="text-secondary text-sm">
                                        When you first learn a card, you'll review it again soon (within 1 day) to reinforce the memory.
                                    </p>
                                </div>
                                <div className="p-4 bg-card-hover rounded-lg">
                                    <h3 className="text-lg font-semibold mb-2">Gradual Spacing</h3>
                                    <p className="text-secondary text-sm">
                                        Each time you successfully recall a card, the interval before the next review increases
                                        (3 days → 7 days → 14 days, etc.).
                                    </p>
                                </div>
                                <div className="p-4 bg-card-hover rounded-lg">
                                    <h3 className="text-lg font-semibold mb-2">Smart Adjustments</h3>
                                    <p className="text-secondary text-sm">
                                        If you forget a card, the interval resets to help reinforce that specific memory.
                                        This ensures you spend more time on challenging material.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Why It Works Section */}
                <div className="card">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-accent/10 rounded-lg">
                            <Target size={24} className="text-accent" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl mb-3">Why This Method is Effective</h2>
                            <p className="text-secondary leading-relaxed mb-3">
                                Spaced repetition is one of the most efficient learning techniques because it:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-secondary ml-4 mb-3">
                                <li><strong>Optimizes study time:</strong> You review cards just before you're likely to forget them,
                                    maximizing retention while minimizing wasted effort</li>
                                <li><strong>Strengthens memory:</strong> Each successful recall makes the memory trace stronger,
                                    moving information from short-term to long-term memory</li>
                                <li><strong>Prevents cramming:</strong> Distributed practice over time is proven to be more effective
                                    than massed practice (cramming) for long-term retention</li>
                                <li><strong>Adapts to you:</strong> The system automatically adjusts to your performance, spending
                                    more time on difficult material and less on what you already know</li>
                            </ul>
                            <p className="text-secondary leading-relaxed">
                                Research shows that spaced repetition can improve retention rates by up to 200% compared to
                                traditional study methods. By following the schedule Memora creates for you, you're leveraging
                                decades of cognitive science research to learn more efficiently.
                            </p>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="card">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-accent/10 rounded-lg">
                            <HelpCircle size={24} className="text-accent" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl mb-3">Frequently Asked Questions</h2>

                            {/* Import Format FAQ */}
                            <div className="mb-6">
                                <div className="flex items-start gap-3 mb-2">
                                    <FileText size={20} className="text-accent mt-1" />
                                    <h3 className="text-xl font-semibold">What file formats can I import?</h3>
                                </div>
                                <div className="ml-8 space-y-3">
                                    <p className="text-secondary leading-relaxed">
                                        Memora supports importing flashcards from text files in the following formats:
                                    </p>
                                    <div className="bg-card-hover rounded-lg p-4 space-y-3">
                                        <div>
                                            <p className="font-semibold text-primary mb-1">Tab-Separated (.txt, .tsv)</p>
                                            <p className="text-secondary text-sm mb-2">One card per line, front and back separated by a tab character:</p>
                                            <pre className="bg-black/20 rounded px-3 py-2 text-xs text-accent font-mono overflow-x-auto">
Question 1{'\t'}Answer 1{'\n'}Question 2{'\t'}Answer 2
                                            </pre>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-primary mb-1">Comma-Separated (.csv)</p>
                                            <p className="text-secondary text-sm mb-2">One card per line, front and back separated by a comma:</p>
                                            <pre className="bg-black/20 rounded px-3 py-2 text-xs text-accent font-mono overflow-x-auto">
Question 1,Answer 1{'\n'}Question 2,Answer 2
                                            </pre>
                                        </div>
                                    </div>
                                    <p className="text-secondary text-sm italic">
                                        💡 Tip: You can create these files in any text editor or export them from spreadsheet applications like Excel or Google Sheets.
                                    </p>
                                </div>
                            </div>

                            {/* Rich Text FAQ */}
                            <div className="mb-0">
                                <div className="flex items-start gap-3 mb-2">
                                    <Code size={20} className="text-accent mt-1" />
                                    <h3 className="text-xl font-semibold">Does Memora support rich text formatting?</h3>
                                </div>
                                <div className="ml-8 space-y-3">
                                    <p className="text-secondary leading-relaxed">
                                        Yes! Memora fully supports HTML formatting in your flashcards, allowing you to create rich,
                                        visually engaging content with:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 text-secondary ml-4">
                                        <li><strong>Text formatting:</strong> Bold, italic, underline, strikethrough, and colored text</li>
                                        <li><strong>Lists:</strong> Bulleted lists, numbered lists, and nested lists</li>
                                        <li><strong>Links:</strong> Clickable hyperlinks to external resources</li>
                                        <li><strong>Code blocks:</strong> Syntax-highlighted code snippets for programming practice</li>
                                        <li><strong>Images:</strong> Embed images using HTML img tags or paste directly</li>
                                        <li><strong>Tables:</strong> Organize information in structured tables</li>
                                    </ul>
                                    <div className="bg-card-hover rounded-lg p-4 mt-3">
                                        <p className="font-semibold text-primary mb-2">How to use HTML formatting:</p>
                                        <p className="text-secondary text-sm mb-3">
                                            When creating or editing cards, you can paste HTML directly into the front or back fields.
                                            The content will be sanitized for security and rendered beautifully during review.
                                        </p>
                                        <p className="text-secondary text-sm">
                                            <strong>Example:</strong> Paste formatted content from web pages, word processors, or use HTML tags
                                            like <code className="bg-black/20 px-1.5 py-0.5 rounded text-accent">&lt;strong&gt;</code>,
                                            <code className="bg-black/20 px-1.5 py-0.5 rounded text-accent ml-1">&lt;em&gt;</code>,
                                            <code className="bg-black/20 px-1.5 py-0.5 rounded text-accent ml-1">&lt;ul&gt;</code>, etc.
                                        </p>
                                    </div>
                                    <p className="text-secondary text-sm italic">
                                        🔒 Security: All HTML content is automatically sanitized to prevent malicious code execution.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Getting Started */}
                <div className="card bg-accent/5 border-accent/20">
                    <h2 className="text-2xl mb-3">Ready to Start Learning?</h2>
                    <p className="text-secondary leading-relaxed mb-4">
                        Create your first deck, add some cards, and let Memora's spaced repetition algorithm
                        guide your learning journey. Remember: consistency is key! Review your due cards daily
                        for the best results.
                    </p>
                    <Link to="/" className="btn btn-primary inline-flex items-center gap-2">
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
