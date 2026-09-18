import json
import numpy as np
from typing import List

class ImageSimilarityEngine:
    @staticmethod
    def cosine_similarity(vec_a: np.ndarray, vec_b: np.ndarray) -> float:
        norm_a = np.linalg.norm(vec_a)
        norm_b = np.linalg.norm(vec_b)
        if norm_a == 0 or norm_b == 0:
            return 0.0
        return float(np.dot(vec_a, vec_b) / (norm_a * norm_b))

    def rank_listings_by_image(self, query_vector: list, listings: List[dict], top_k: int = 6) -> List[dict]:
        query_arr = np.array(query_vector, dtype=np.float32)
        results = []

        for item in listings:
            emb_str = item.get('image_embedding')
            if not emb_str:
                sim = 0.72 if item.get('material_name') == item.get('query_material') else 0.45
            else:
                try:
                    vec = np.array(json.loads(emb_str), dtype=np.float32)
                    sim = self.cosine_similarity(query_arr, vec)
                    sim = max(0.40, min(0.98, (sim + 1.0) / 2.0))
                except Exception:
                    sim = 0.50

            item_copy = dict(item)
            item_copy['similarity_score'] = round(sim * 100, 1)
            results.append(item_copy)

        results.sort(key=lambda x: x['similarity_score'], reverse=True)
        return results[:top_k]

image_similarity_engine = ImageSimilarityEngine()
