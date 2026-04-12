import requests
import json
import random

def fetch_leetcode_questions(limit=1500):
    url = "https://leetcode.com/graphql"
    query = """
    query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) { 
        problemsetQuestionList: questionList(categorySlug: $categorySlug limit: $limit skip: $skip filters: $filters) { 
            total: totalNum 
            questions: data { 
                acRate 
                difficulty 
                freqBar 
                frontendQuestionId: questionFrontendId 
                title 
                titleSlug 
                topicTags { name id slug } 
            } 
        } 
    }
    """
    
    all_questions = []
    
    # LeetCode limits results to 100 at a time typically. Keep fetching until we hit limit.
    batch_size = 100
    for skip in range(0, limit, batch_size):
        variables = {
            "categorySlug": "",
            "skip": skip,
            "limit": batch_size,
            "filters": {}
        }
        
        response = requests.post(url, json={"query": query, "variables": variables})
        
        if response.status_code == 200:
            batch = response.json().get('data', {}).get('problemsetQuestionList', {}).get('questions', [])
            if not batch:
                break
            all_questions.extend(batch)
        else:
            print(f"Failed to fetch data: {response.status_code}")
            break
            
    return all_questions

def map_tags_to_taxonomy(tags_list):
    tags = [tag['name'] for tag in tags_list]
    
    if "Array" in tags:
        if "Two Pointers" in tags: return ("Array", "Two Pointer")
        if "Sliding Window" in tags: return ("Array", "Sliding Window")
        if "Prefix Sum" in tags: return ("Array", "Prefix Based")
        if "Binary Search" in tags: return ("Array", "Binary Search")
        return ("Array", "Kadane's / Subarray")
    if "String" in tags:
        if "Sliding Window" in tags: return ("String", "Sliding Window")
        if "Two Pointers" in tags: return ("String", "Two Pointers")
        return ("String", "Pattern Matching")
    if "Hash Table" in tags:
        return ("Hash map", "Frequency Based")
    if "Stack" in tags:
        if "Monotonic Stack" in tags: return ("Stack", "Monotonic Stack")
        return ("Stack", "Expression Handling")
    if "Queue" in tags or "Deque" in tags:
        return ("Queue / Deque", "FIFO Processing")
    if "Linked List" in tags:
        if "Two Pointers" in tags: return ("Linked List", "Pointer Techniques")
        return ("Linked List", "Reversal")
    if "Tree" in tags or "Binary Tree" in tags:
        if "Binary Search Tree" in tags: return ("Trees", "BST")
        if "Depth-First Search" in tags: return ("Trees", "Traversal")
        return ("Trees", "Recursion Patterns")
    if "Recursion" in tags or "Backtracking" in tags:
        return ("Recursion", "Backtracking")
    if "Heap (Priority Queue)" in tags:
        return ("Heap", "Top K")
    if "Graph" in tags:
        if "Breadth-First Search" in tags or "Depth-First Search" in tags: return ("Graphs", "Traversal")
        if "Topological Sort" in tags: return ("Graphs", "Topological Sort")
        if "Shortest Path" in tags: return ("Graphs", "Shortest Path")
        return ("Graphs", "Cycle Detection")
    if "Trie" in tags:
        return ("Trie", "Prefix Based")
    if "Dynamic Programming" in tags:
        return ("Dynamic Programming", "Core")
    if "Greedy" in tags:
        return ("Greedy", "Interval Greedy")
    if "Bit Manipulation" in tags:
        return ("Bit Manipulation", "Core")
    if "Sorting" in tags:
        return ("Sorting Algorithms", "Merge Sort")
    if "Segment Tree" in tags or "Binary Indexed Tree" in tags:
        return ("Range Structures", "Segment Tree")

    return ("Array", "Two Pointer")

def generate_database():
    print("Fetching from LeetCode...")
    lc_questions = fetch_leetcode_questions(limit=1500)
    
    companies = ['Google', 'Amazon', 'Microsoft', 'Meta', 'Apple', 'Netflix', 'Uber', 'Adobe', 'TCS', 'Infosys', 'Wipro']
    years = ['2026', '2025', '2024', '2023', '2022', '2021', '2020']
    
    final_data = []
    
    for q in lc_questions:
        topic, subtopic = map_tags_to_taxonomy(q.get('topicTags', []))
        diff = q['difficulty']
        
        comp_count = random.randint(1, 4)
        q_companies = random.sample(companies, comp_count)
        
        final_data.append({
            "id": f"lc-{q['frontendQuestionId']}",
            "title": q['title'],
            "platform": "LeetCode",
            "difficulty": diff,
            "topic": topic,
            "subtopic": subtopic,
            "companies": q_companies,
            "year": random.choice(years),
            "acceptance": f"{int(q.get('acRate', 0))}%",
            "link": f"https://leetcode.com/problems/{q['titleSlug']}/"
        })

    # High-quality Striver / Babbar curated set with PROPER GFG URLs.
    striver_babbar_set = [
        {"id": "gfg-rev-arr", "title": "Reverse an Array", "platform": "GeeksForGeeks", "difficulty": "Basic", "topic": "Array", "subtopic": "Two Pointer", "link": "https://www.geeksforgeeks.org/problems/reverse-an-array/0"},
        {"id": "gfg-min-max", "title": "Find minimum and maximum element in an array", "platform": "GeeksForGeeks", "difficulty": "Basic", "topic": "Array", "subtopic": "Binary Search", "link": "https://www.geeksforgeeks.org/problems/find-minimum-and-maximum-element-in-an-array4428/1"},
        {"id": "gfg-kth-small", "title": "Kth smallest element", "platform": "GeeksForGeeks", "difficulty": "Medium", "topic": "Array", "subtopic": "Kadane's / Subarray", "link": "https://www.geeksforgeeks.org/problems/kth-smallest-element5635/1"},
        {"id": "gfg-sort-012", "title": "Sort an array of 0s, 1s and 2s", "platform": "GeeksForGeeks", "difficulty": "Easy", "topic": "Array", "subtopic": "Two Pointer", "link": "https://www.geeksforgeeks.org/problems/sort-an-array-of-0s-1s-and-2s4231/1"},
        {"id": "gfg-min-jumps", "title": "Minimum number of jumps", "platform": "GeeksForGeeks", "difficulty": "Medium", "topic": "Array", "subtopic": "Sliding Window", "link": "https://www.geeksforgeeks.org/problems/minimum-number-of-jumps-1587115620/1"},
        {"id": "gfg-dup", "title": "Find duplicates in an array", "platform": "GeeksForGeeks", "difficulty": "Easy", "topic": "Hash map", "subtopic": "Frequency Based", "link": "https://www.geeksforgeeks.org/problems/find-duplicates-in-an-array/1"},
        {"id": "gfg-kadane", "title": "Kadane's Algorithm", "platform": "GeeksForGeeks", "difficulty": "Medium", "topic": "Array", "subtopic": "Kadane's / Subarray", "link": "https://www.geeksforgeeks.org/problems/kadanes-algorithm-1587115620/1"},
        {"id": "gfg-merge", "title": "Merge Without Extra Space", "platform": "GeeksForGeeks", "difficulty": "Hard", "topic": "Array", "subtopic": "Two Pointer", "link": "https://www.geeksforgeeks.org/problems/merge-two-sorted-arrays-1587115620/1"},
        {"id": "hr-1", "title": "Merge Sort (Algorithm)", "platform": "HackerRank", "difficulty": "Medium", "topic": "Recursion", "subtopic": "Divide & Conquer", "link": "https://www.hackerrank.com/challenges/ctci-merge-sort/problem"},
        {"id": "hr-2", "title": "Ransom Note", "platform": "HackerRank", "difficulty": "Easy", "topic": "String", "subtopic": "Pattern Matching", "link": "https://www.hackerrank.com/challenges/ctci-ransom-note/problem"},
        {"id": "hr-3", "title": "Balanced Brackets", "platform": "HackerRank", "difficulty": "Medium", "topic": "Stack", "subtopic": "Expression Handling", "link": "https://www.hackerrank.com/challenges/balanced-brackets/problem"}
    ]
    
    for q in striver_babbar_set:
        comp_count = random.randint(1, 4)
        q['companies'] = random.sample(companies, comp_count)
        q['year'] = random.choice(years)
        q['acceptance'] = f"{random.randint(35, 95)}%"
        final_data.append(q)

    # Sort final data so basic/easy come first just for mix
    final_data = sorted(final_data, key=lambda x: ['Basic', 'Easy', 'Medium', 'Hard'].index(x['difficulty']) if x['difficulty'] in ['Basic', 'Easy', 'Medium', 'Hard'] else 1)
    
    with open("src/utils/questions.json", "w") as f:
        json.dump(final_data, f, indent=2)
        
    print(f"Generated Database with {len(final_data)} questions.")

if __name__ == "__main__":
    generate_database()
